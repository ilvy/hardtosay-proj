/**
 * Created by Administrator on 14-10-23.
 */
var uopDao = require("../../dao/useroperateDao"),
    response = require("../response"),
    session = require("../../socket/session").session,
    protocolConfig = require("../../socket/protocolConfig"),
    JPush = require("../../JPush/JPush"),
    dbOperator = require("../../db/dbOperator"),
    socketResponse = require("../../socket/response").response,
    async = require("async");

exports.search = function(req,res){
    var data = req.query;
    var search_key = data.search_key;//TODO 用户名，手机号，e-mail
    var sender = data.user;
    if(!session.authority(sender)){
        response.failed(res,"权限不足");
        return;
    }
    var position = {
        searck_key:search_key,
        sender:sender
    }
    var selectUsersFuns = [
        function selectUsersByKey(cb){
            uopDao.selectUsersByKey(position,function(err,results){
                if(err){
                    console.log("selectUsersByKey failed:"+err);
//                    response.failed(res,"查询失败");
                    cb(err,null);
                    return;
                }
                cb(null,results);
//                response.success(res,"用户查询",results);
            });
        },
        function dereference(results,outcb){
            if(results && results.length){
                var getImageFuns = [];
                for(var i in results){
                    if(typeof results[i].image == 'object'){
                        getImageFuns.push((function(){
                            var k = i;
                            return function(cb){
                                dbOperator.dereference(results[k].image,function(err,imageObj){
                                    if(err){
                                        cb(err,null);
                                        return;
                                    }
                                    results[k].image = imageObj;
                                    cb(null,null);
                                });
                            }
                        })());
                    }
                }
                async.parallel(getImageFuns,function(err,results1){
                    if(err){
                        cb(err,null);
                        return;
                    }
                    outcb(null,results);
                })
            }
        }
    ];
    async.waterfall(selectUsersFuns,function(err,results){
        if(err){
            console.log("selectUsersByKey failed:"+err);
            response.failed(res,"查询失败");
            return;
        }
//        cb(null,results);
        response.success(res,"用户查询",results);
    })

}

exports.addRelation = function(req,res){
    var data = req.query;
    var user1 = data.user1,
        user2 = data.user2,
        relative = data.relative;
    if(!session.authority(user1)){
        response.failed(res,"请重新登录");
        return;
    }
    var funs = [];
    funs = [
        function isExistRelative(cb){
            //确认关系是否存在
            uopDao.selectRelatives({host_id:user1,relative_id:user2},function(err,results){
                if(results && results.length > 0){
                    return;
                }
                cb(err,null);
            });
        },
        function add(cb){
            uopDao.addRelation(user1,user2,relative,function(err,results){
                if(err){

                }else{
                    response.success(res,"请求发送成功",{});
                    var sender = getUserInfo(user1,results);
                    var receiverAuth = socketResponse.socket(user2);//session.authority(user2);
                    //1、判断被请求用户是否在线,若在线，直接发送请求
                    if(receiverAuth){
                        sender.relative = relative;
                        sender.status = 0;
                        sender.relativeFlag = -1;
                        sender.type = "request";
                        sender.relative_id = sender.user_id;
                        sender.relative_name = sender.name;
                        receiverAuth.emit(protocolConfig.ADDRELATION,sender);
                    }else{//2、若不在线，推送该消息
                        JPush.pushMessage("android",user2,{
                            content:sender.name+"请求加你为"+relative,
                            title:"推送消息"
                        },function(err,res){
                            if(err){
                                console.log(err);
                            }else{
                                console.log('Sendno: ' + res.sendno);
                                console.log('Msg_id: ' + res.msg_id);
                            }
                        });
                    }

                }
                cb(err,results);
            })
        }
    ];
    async.series(funs,function(err,results){
        //TODO
        console.log(err);
    })

};

/**
 * 回复加关系请求
 * @param req
 * @param res
 */
exports.replyAddRelationRequest = function(req,res){
    var data = req.query;
    var position = {};
    position.sender = data.sender;
    position.receiver = data.receiver;
    var reply = data.reply;
    position.status = reply == 1?1:2;
    uopDao.updateRelation(position,function(err,results){
        if(err){

        }else{
            if(results == 0){
                return;
            }
            dbOperator.select('relative',{$or:[{host_id:data.sender,relative_id:data.receiver},{relative_id:data.sender,host_id:data.receiver}]},function(err,results1){
                if(err){

                }else{
                    if(!results1 || results1.length == 0){
                        return;
                    }
                    var data = {

                    };
                    //请求方信息
                    var requester = getUserInfo(position.receiver,results1);
                    //接收方信息
                    var receiverInfo = getUserInfo(position.sender,results1);
                    if(reply == 1){ // 请求接收者同意加关系，将请求方的具体信息发送至接收者，并准备好请求接收方的接收数据
                        receiverInfo.status = 1;
                        receiverInfo.type = 'reply';
                        response.success(res,"",requester);//同意后，发送请求方的个人信息
                    }else if(reply == 2){
                        receiverInfo.status = 2;
                    }
                    var receiverAuth = socketResponse.socket(position.receiver);
                    if(receiverAuth){
                        //1、直接发送
                        socketResponse.send(position.receiver,protocolConfig.ADDRELATION,receiverInfo);
                    }else{
                        //1、先存储该消息
                        uopDao.tagNewRelation(position,function(err,results){
                            if(err){

                            }else{//2、推送给用户
                                JPush.pushMessage("android",position.receiver,{
                                    content:position.sender+"已通过您的请求",
                                    title:"推送消息"
                                },function(err,res){
                                    if(err){
                                        console.log(err);
                                    }else{
                                        console.log('Sendno: ' + res.sendno);
                                        console.log('Msg_id: ' + res.msg_id);
                                    }
                                });
                            }

                        })


                    }
                }
            });
        }
    });
}

/**
 *
 * @param id
 * @param results
 * @returns {*}
 */
function getUserInfo(id,results){
    for(var i = 0; i < results.length; i++){
        if(results[i].user_id == id || results[i].relative_id == id){
            return results[i];
        }
    }
    return null;
}