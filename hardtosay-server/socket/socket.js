/**
 * Created by Administrator on 14-9-10.
 */

var protocolConfig = require("./protocolConfig"),
    dbOperator = require("../db/dbOperator"),
    async = require("async"),
    response = require("./response").response,
    session = require("./session").session,
    pushMessage = require("../JPush/JPush").pushMessage,
    userOperate = require("../dao/useroperateDao"),
    messageDao = require("../dao/messageDao"),
    util = require("../util/util"),
    replyPushmsgConfig = require("../config/config").replyPushmsgConfig;
var io,
    online_users = {};

function SocketServer(server){
    io = require("socket.io")(server);
    io.on("connection",function(socket){
        console.log("new connection");
        socketLogin(socket);
        message(socket);
        apology(socket);
        logout(socket);
        reply(socket);
    });
}

/**
 * 注册新用户
 * @param socket
 */
function register(socket){
    socket.on(protocolConfig.REGISTER,function(data){
        var user = data.user;
        if(user){
            var addUser = function(results,cb){
                if(results && results.length > 0){
                    dbOperator.save("user",user,function(err,results){
                        cb(err,results);
                    });
                }else{
                    cb(null,null);
                }
            }
            var funs = [isExistUser(data),addUser];
            async.waterfall(funs,function(err,results){
               if(err){
                   return;
               }

            });
        }
    });
}

/**
 * 用户登录
 * @param socket
 */
function socketLogin(socket){
    socket.on(protocolConfig.LOGIN,function(data){
        var user = data.user;
        var userName = user.name,auth;
        if(!(auth = session.authority(userName))){//session无登录记录
            response.send(userName,protocolConfig.LOGIN,{
                flag:0,
                msg:"socket 登录失败!"
            });
            return;
        }
        response.socket(userName,socket);
        var position = {host_id:userName};
        userOperate.selectRelatives(position,function(err,results){
            if(err){
                console.log(err);
            }else{
                response.send(userName,protocolConfig.LOGIN,{
                    flag:1,
                    msg:"socket 登录成功!",
                    data:results
                });
            }
        })
    });
}

/**
 * 用户主动获取消息以及回复信息
 * @param socket
 */
function message(socket){
    socket.on(protocolConfig.MESSAGE,function(data){
        var relative_id = data.relative_id,sender = data.sender;
        var position = {
            receiver:relative_id,
            sender:sender
//            newestTime:data.newestTime
        };

        messageDao.selectMessages(position,function(err,results){
            if(err){
                console.log(err);
                response.send(socket,protocolConfig.MESSAGE,{
                    flag:0,
                    msg:"get message failed",
                    type:"message",
                    data:err
                });
            }else{
                response.send(socket,protocolConfig.MESSAGE,{
                    flag:1,
                    msg:"get message success",
                    type:"message",
                    data:results
                });
                //更改消息状态
                messageDao.updateMessageStatus(position,function(err,results){
                    if(err){

                    }else{

                    }
                })
            }
        });
        messageDao.selectReplys(position,function(err,results){
            if(err){
                console.log(err);
                response.send(socket,protocolConfig.MESSAGE,{
                    flag:0,
                    msg:"get message failed",
                    type:"reply",
                    data:err
                });
            }else{
                response.send(socket,protocolConfig.MESSAGE,{
                    flag:1,
                    msg:"get message success",
                    type:"reply",
                    data:results
                });
                //更改消息状态
                messageDao.updateReplyStatus(position,function(err,results){

                });
            }
        });

    })
}

/**
 *
 * @param socket
 */
function apology(socket){
    socket.on(protocolConfig.APOLOGY,function(data){
        console.log(data);
            var sender = data.sender;
        var userName = sender,auth;
        if(!(auth = session.authority(userName))){//session无登录记录
            return;
        }
        var msgObj = {type:protocolConfig.APOLOGY};
        msgObj.sender = data.sender;
        msgObj.receiver = data.receiver;
        msgObj.message = data.message;
        msgObj.time = util.formatDate(new Date(),true);
        msgObj.message_id = data.message_id;
        msgObj.relative = data.relative;
        //从session中查询目标用户是否已经登录，若未登录，存于数据库，并推送，若已经登录，直接发送消息即可
        //1、从session中查询目标用户
        var receiverAuth = session.authority(msgObj.receiver);
        if(!receiverAuth){
            msgObj.status = 0;
            //1、存数据
            dbOperator.save("message",msgObj,function(err,results){
                if(err){
                    console.log(err);
                }else{
                    //2、应答发送方，发送成功
                    socket.emit("message_ack",{
                        message_id:msgObj.message_id,
                        interval:data.interval
                    });
                    //3、推送
                    pushMessage("android",msgObj.receiver,{
                        content:msgObj.message,
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
            });
        }else{
            msgObj.status = 1;
            //1、存数据
            dbOperator.save("message",msgObj,function(err,results){
                if(err){
                    console.log(err);
                }else{
                    //2、应答发送方，发送成功
                    socket.emit("message_ack",{
                        message_id:msgObj.message_id,
                        interval:data.interval
                    });
                    //3、直接发送给接收用户
                    var receiveSocket = response.socket(msgObj.receiver);
                    if(receiveSocket){
                        receiveSocket.emit(protocolConfig.APOLOGY,msgObj);
                        //4、修改消息状态
                    }

                }
            })
        }
    });
}

function reply(socket){
    socket.on(protocolConfig.REPLY,function(data){
        //1、从session中查询目标用户
        var receiverAuth = session.authority(data.receiver);
        data.time = util.formatDate(new Date(),true);
        data.status = 0;
        if(!receiverAuth){
            messageDao.saveReply(data,function(err,results){
                if(err){
                    console.log(data.sender+"发送回复失败，"+err);
                    return;
                }
                //2、应答发送方，发送成功
//                socket.emit("reply_ack",{
//                    message_id:msgObj.message_id,
//                    interval:data.interval
//                });
                //3、推送
                pushMessage("android",data.receiver,{
                    content:data.sender+"发来消息："+replyPushmsgConfig.apology[data.reply],
                    title:"推送消息"
                },function(err,res){
                    if(err){
                        console.log(err);
                    }else{
                        console.log('Sendno: ' + res.sendno);
                        console.log('Msg_id: ' + res.msg_id);
                    }
                });
            });
        }else{
            data.status = 1;
            messageDao.saveReply(data,function(err,results){
                if(err){
                    console.log(data.sender+"发送回复失败，"+err);
                    return;
                }
                //2、应答发送方，发送成功
//                socket.emit("reply_ack",{
//                    message_id:msgObj.message_id,
//                    interval:data.interval
//                });
                //3、直接发送给接收用户
                var receiveSocket = response.socket(data.receiver);
                if(receiveSocket){
                    receiveSocket.emit(protocolConfig.REPLY,data);
                    //4、修改消息状态
                }
            });
        }

    })
}

function logout(socket){
    socket.on(protocolConfig.logout,function(data){
        var user = data.user;
        session.removeAuth(user);
        response.removeSocket(user);
    });
}

function messageAck(socket){
    socket.on()
}

/**
 * 检查用户是否已经存在
 * @param cb
 */
var isExistUser = function(data){
    return function(cb){
        dbOperator.select("user",{name:data.user.name},function(err,results){
            cb(err,results);
        });
    }

};


module.exports = SocketServer;
