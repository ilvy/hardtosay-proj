/**
 * Created by Administrator on 14-10-14.
 */

var dbOperator = require("../db/dbOperator");

exports.selectRelatives = function(position,cb){
//    var posObj = {};
//    posObj.host_id = position.host_id;
//    if(position.relative_id){
//        posObj.relative_id = position.relative_id;
//    }
    dbOperator.select("relative",{host_id:position.host_id},cb);
}

exports.selectUsersByKey = function(search_key,cb){
    dbOperator.select('user',{$or:[{user_id:search_key},{name:new RegExp(search_key)},{tel:search_key},{email:search_key}]},cb);
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