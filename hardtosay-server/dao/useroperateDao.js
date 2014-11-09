/**
 * Created by Administrator on 14-10-14.
 */

var dbOperator = require("../db/dbOperator"),
    async = require("async");

exports.selectRelatives = function(position,cb){
//    var posObj = {};
//    posObj.host_id = position.host_id;
//    if(position.relative_id){
//        posObj.relative_id = position.relative_id;
//    }
    if(!position.relative_id){
        dbOperator.select("relative",{host_id:position.host_id},cb);
    }else{
        dbOperator.select("relative",{host_id:position.host_id,relative_id:position.relative_id},cb);
    }

}


exports.selectUsersByKey = function(position,callback){
    var search_key = position.searck_key;
    var sender = position.sender;
    dbOperator.select('user',{$and:[{$nor:[{user_id:sender}]},{$or:[{user_id:search_key},{name:new RegExp(search_key)},{tel:search_key},{email:search_key}]}]},
        function(err,results){
            if(err){

            }else{
                if(results && results.length > 0){
                    var record,funs = [];
                    for(var i = 0; i < results.length; i++){
                        record = results[i];
                        funs.push((function(){
                            var relative = record;
                            return function(cb){
                                dbOperator.select("relative",{host_id:record.user_id,relative_id:sender},function(err,results){
                                    if(results && results.length > 0){
                                        cb(err,null);
                                    }else{
                                        cb(err,relative);
                                    }
                                });
                            }
                        })());
                    }
                    async.parallel(funs,function(err,results){
                        var resData = [];
                        for(var i = 0; i < results.length; i++){
                            if(results[i] != null){
                                resData.push(results[i]);
                            }
                        }
                        callback(err,resData);
                    });
                }
            }
        });
}

//exports.addRelation = function(user1,user2,relative,cb){
//    dbOperator.select('user',{$or:[{user_id:user1},{user_id:user2}]},function(err,results){
//        if(err){
//            console.log("addRelation failed,select user fail:"+err);
//            return;
//        }
//        var u1 = results[0],u2 = results[1];
//        //绑定relative关系
//        dbOperator.save("relative",{host_id:u1.user_id,host_name:u1.name,relative_id:u2.user_id,relative_name:u2.name,
//                         image:u2.image,relative:relative,status:0,relativeFlag:(u1.user_id == user1?"1":"-1")},function(err1,res1){
//            if(err1){
//
//            }else{
//                dbOperator.save("relative",{host_id:u2.user_id,host_name:u2.name,relative_id:u1.user_id,relative_name:u1.name,
//                    image:u1.image,relative:relative,status:0,relativeFlag:(u2.user_id == user1?"1":"-1")},function(err2,res2){
//                    cb(err2,results);
//                });
//
//            }
//        });
//
//    })
//}

exports.addRelation = function(user1,user2,relative,cb){
    dbOperator.select('user',{$or:[{user_id:user1},{user_id:user2}]},function(err,results){
        if(err){
            console.log("addRelation failed,select user fail:"+err);
            return;
        }
        var u1 = results[0],u2 = results[1];
        //绑定relative关系
        dbOperator.save("relative",{host_id:u1.user_id,host_name:u1.name,relative_id:u2.user_id,relative_name:u2.name,
                         image:u2.image,relative:relative,status:0,relativeFlag:(u1.user_id == user1?"1":"-1")},function(err1,res1){
            if(err1){

            }else{
                dbOperator.save("relative",{host_id:u2.user_id,host_name:u2.name,relative_id:u1.user_id,relative_name:u1.name,
                    image:u1.image,relative:relative,status:0,relativeFlag:(u2.user_id == user1?"1":"-1")},function(err2,res2){
                    cb(err2,results);
                });

            }
        });

    })
}



/**
 * 激活关系
 * @param user1
 * @param user2
 * @param cb
 */
exports.updateRelation = function(position,cb){
    dbOperator.update('relative',{$or:[{host_id:position.sender,relative_id:position.receiver,status:0},
        {host_id:position.receiver,relative_id:position.sender,status:0}]},{$set:{status:position.status}},cb);
}


exports.selectRelationRequests = function(position,cb){
    dbOperator.select('relative',{$or:[{relative_id:position.sender,host_id:position.receiver,status:0},
        {relative_id:position.sender,host_id:position.receiver,isNewRelative:1}]},cb);
}

/**
 * 接收方同意或拒绝后，发送发未收到回复需要对消息打上未接收标记
 * @param position
 * @param cb
 */
exports.tagNewRelation = function(position,cb){
    dbOperator.update("relative",{relative_id:position.sender,host_id:position.receiver},{$set:{isNewRelative:1}},cb);
}

/**
 *
 * @param position
 * @param cb
 */
exports.tagOldRelation = function(position,cb){
    dbOperator.update("relative",{relative_id:position.sender,host_id:position.receiver},{$set:{isNewRelative:0}},cb);
}

exports.register = function(position,callback){
    var funs = [
        function isExistUser(cb){
            dbOperator.select("user",{user_id:position.user_id},function(err,results){
                cb(err,results);
            })
        },
        function addUser(existUsers,cb){
            if(existUsers.length == 0){
                dbOperator.save("user",position,callback);
                cb(null,{result:"注册成功"});
            }else{
                callback(null,{code:11,msg:"用户名重复"});
                cb(null,{result:"注册失败"});
            }

        }
    ];
    async.waterfall(funs,function(err,results){
        console.log(results);
    })
}