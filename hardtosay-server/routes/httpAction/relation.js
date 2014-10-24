/**
 * Created by Administrator on 14-10-23.
 */
var uopDao = require("../../dao/useroperateDao"),
    response = require("../response"),
    session = require("../../socket/session").session,
    protocolConfig = require("../../socket/protocolConfig"),
    JPush = require("../../JPush/JPush");

exports.search = function(req,res){
    var data = req.query;
    var search_key = data.search_key;//TODO 用户名，手机号，e-mail
    uopDao.selectUsersByKey(search_key,function(err,results){
        if(err){
            console.log("selectUsersByKey failed:"+err);
            response.failed(res,"查询失败");
            return;
        }
        response.success(res,"用户查询",results);
    });
}

exports.addRelation = function(req,res){
    var data = req.query;
    var user1 = data.user1,
        user2 = data.user2,
        relative = data.relative;
    uopDao.addRelation(user1,user2,relative,function(err,results){
        if(err){

        }else{
            var sender = getUserInfo(user1,results);
            var receiverAuth = session.authority(user2);
            //TODO 1、判断被请求用户是否在线,若在线，直接发送请求
            if(receiverAuth){
                receiverAuth.emit(protocolConfig.ADDRELATION,sender);
            }else{//TODO 2、若不在线，推送该消息
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
    })
}

/**
 *
 * @param id
 * @param results
 * @returns {*}
 */
function getUserInfo(id,results){
    for(var i = 0; i < results.length; i++){
        if(results[i].user_id == id){
            return results[i];
        }
    }
    return null;
}