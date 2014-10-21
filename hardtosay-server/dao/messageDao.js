/**
 * Created by Administrator on 14-10-14.
 */

var dbOperator = require("../db/dbOperator");

exports.selectMessages = function(position,cb){
    dbOperator.select("message",{$or:[{receiver:position.receiver,sender:position.sender,time:{$gt:position.newestTime}}
                                    ,{receiver:position.sender,sender:position.receiver,time:{$gt:position.newestTime}}]},cb);
}