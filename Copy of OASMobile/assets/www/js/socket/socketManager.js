/**
 * Created by Administrator on 14-9-10.
 */


function Socket(host,port,cb){
    this.socket = this.connect(host,port);
    this.onConnect(cb);
    this.onError();
    this.onFailed();
    this.onLogin();
//    this.onMessage();
}

Socket.prototype.connect = function(host,port){
    var socket = io("http://"+host+":"+port);
    return socket;
}

/**
 * socket 建立连接监听，建立连接后，发送用户socket登录请求
 * @param cb：发送用户socket登录请求函数
 */
Socket.prototype.onConnect = function(cb){
    this.socket.on("connect",function(data){
        console.log("connect:"+data);
    })
    if(cb){
        cb(this.socket);
    }
}

Socket.prototype.onError = function(){
    this.socket.on("error",function(data){
        console.log("error:"+data);
    });
}

Socket.prototype.onFailed = function(){
    this.socket.on("connect_failed",function(data){
        console.log("failed:"+data);
    })
}

Socket.prototype.sendMessage = function(event,msgObj,cb){
    this.socket.emit(event,msgObj);
    if(cb){
        socket.onMessage(event,cb);
    }
}

var socket;

//Socket.prototype.onEvent = function(){
//    this.socket.on("login",function(data){
//
//    });
//}

/**
 * 监听器
 */
Socket.prototype.onLogin = function(){
    this.socket.on("login",function(data){
        console.log(data);
        if(data.flag == 1){
            changeHash("#relative",data);
            util.$ls("humansData",data.data);
        }
    });
}

Socket.prototype.onRegister = function(){
    this.socket.on("register",function(data){

    });
}

Socket.prototype.onAddRelation = function(){
    this.socket.on("addRelation",function(data){

    });
}

Socket.prototype.onMessage = function(protocol,cb){
    this.socket.on(protocol,cb);
}

Socket.prototype.onReply = function(){
    this.socket.on("reply",function(data){

    });
}

var protocolConfig = {
    apology:"apology",
    message:"message"
};