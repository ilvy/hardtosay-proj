/**
 * Created by Administrator on 14-10-14.
 */

var dbOperator = require("../db/dbOperator");

exports.selectRelatives = function(host_name,cb){
    dbOperator.select("relative",{host_name:host_name},cb);
}

exports.selectUsersByKey = function(search_key,cb){
    dbOperator.select('user',{$or:[{user_id:search_key},{name:new RegExp(search_key)},{tel:search_key},{email:search_key}]},cb);
}

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
                    image:u1.image,relative:relative,status:0,relativeFlag:(u1.user_id == user1?"1":"-1")},function(err2,res2){
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
exports.activateRelation = function(user1,user2,cb){
    dbOperator.update('relative',{host_id:user1,relative_id:user2},{$set:{status:1}},cb);
}