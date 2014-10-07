/**
 * Created by Administrator on 14-9-10.
 */

var protocolConfig = require("./protocolConfig"),
    dbOperator = require("../db/dbOperator"),
    async = require("async"),
    response = require("./response").response;
var io,
    online_users = {};

function SocketServer(server){
    io = require("socket.io")(server);
    io.on("connection",function(socket){
        console.log("new connection");
        login(socket)
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
function login(socket){
    socket.on(protocolConfig.LOGIN,function(data){
        var user = data.user;
        if(user){
            var funs = [isExistUser(data)];
            async.series(funs,function(err,results){
                if(err){
                    return;
                }else{
                    if(results[0] && results[0].length > 0){
                        response.addSocket(user.name,socket);
                        response.success(user.name,data.protocal,{
                            flag:1,msg:"login success"
                        });
                    }else{

                    }
                }

            });
        }
    });
}

function appology(socket){
    socket.on(protocolConfig.APPOLOGY,function(data){
        console.log(data);
        var msgObj = {type:protocolConfig.APPOLOGY};
        msgObj.sender = data.from;
        msgObj.receiver = data.to;
        msgObj.message = data.msg;
        msgObj.time = new Date();
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
