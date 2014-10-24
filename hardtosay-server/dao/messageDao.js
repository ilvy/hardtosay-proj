/**
 * Created by Administrator on 14-10-14.
 */

var dbOperator = require("../db/dbOperator");

/**
 * 主动获取消息时，只获取发送方未接收的消息
 * @param position
 * @param cb
 */
exports.selectMessages = function(position,cb){
    dbOperator.select("message",{receiver:position.sender,sender:position.receiver,status:0},{sort:{time:1}},cb);
}
//exports.selectMessages = function(position,cb){
//    dbOperator.selectMessagewidthReply({receiver:position.sender,sender:position.receiver,status:0},{time:1},cb);
//}

exports.updateMessageStatus = function(position,cb){
    dbOperator.update("message",{receiver:position.sender,sender:position.receiver,status:0},{$set:{status:1}},cb);
}

/**
 *
 * @param replyObj
 * @param cb
 */
exports.saveReply = function(replyObj,cb){
    dbOperator.save("reply",replyObj,cb);
}

/**
 * 获取消息恢复信息
 * @param position
 * @param cb
 */
exports.selectReplys = function(position,cb){
    dbOperator.select("reply",{receiver:position.sender,sender:position.receiver,status:0},{time:1},cb);
}
exports.updateReplyStatus = function(position,cb){
    dbOperator.update("reply",{receiver:position.sender,sender:position.receiver,status:0},{$set:{status:1}},cb);
}