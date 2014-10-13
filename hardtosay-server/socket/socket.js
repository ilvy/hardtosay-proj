/**
 * Created by Administrator on 14-9-10.
 */

var protocolConfig = require("./protocolConfig"),
    dbOperator = require("../db/dbOperator"),
    async = require("async"),
    response = require("./response").response,
    session = require("./session").session,
    pushMessage = require("../JPush/JPush").pushMessage;
var io,
    online_users = {};

function SocketServer(server){
    io = require("socket.io")(server);
    io.on("connection",function(socket){
        console.log("new connection");
        socketLogin(socket);
        appology(socket);
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
        response.send(userName,protocolConfig.LOGIN,{
            flag:1,
            msg:"socket 登录成功!"
        });
    });
}

/**
 *
 * @param socket
 */
function appology(socket){
    socket.on(protocolConfig.APPOLOGY,function(data){
        console.log(data);
        var sender = data.sender;
        var userName = data.name,auth;
        if(!(auth = session.authority(userName))){//session无登录记录
            return;
        }
        var msgObj = {type:protocolConfig.APPOLOGY};
        msgObj.sender = data.sender;
        msgObj.receiver = data.receiver;
        msgObj.message = data.msg;
        msgObj.time = new Date();
        //从session中查询目标用户是否已经登录，若未登录，存于数据库，并推送，若已经登录，直接发送消息即可
        //1、从session中查询目标用户
        var receiverAuth = session.authority(msgObj.receiver);
        if(!receiverAuth){
            //1、存数据
            dbOperator.save("message",msgObj,function(err,results){
                if(err){
                    console.log(err);
                }else{
                    //2、推送
                    pushMessage("android",msgObj.receiver,msgObj.message,"推送消息");
                }
            });
        }else{
            //1、存数据
            dbOperator.save("message",msgObj,function(err,results){
                if(err){
                    console.log(err);
                }else{
                    //2、直接发送给接收用户
                    var receiveSocket = response.socket(msgObj.receiver);
                    receiveSocket.emit(protocolConfig.APPOLOGY,msgObj);
                }
            })
        }
    });
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
