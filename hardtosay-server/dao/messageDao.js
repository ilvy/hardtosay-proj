/**
 * Created by Administrator on 14-10-14.
 */

var dbOperator = require("../db/dbOperator");

exports.selectMessages = function(position,cb){
    dbOperator.select("message",{receiver:position.receiver,sender:position.sender},cb);
}