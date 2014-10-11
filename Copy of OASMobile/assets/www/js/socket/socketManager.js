/**
 * Created by Administrator on 14-9-10.
 */

function Socket(host,port){
    this.socket = this.connect(host,port);
}

Socket.prototype.connect = function(host,port){
    var socket = io("http://"+host+":"+port);
    return socket;
}

Socket.prototype.sendMessage = function(event,msgObj){
    this.socket.emit(event,msgObj);
}

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

Socket.prototype.onMessage = function(){
    this.socket.on("message",function(data){

    });
}

Socket.prototype.onReply = function(){
    this.socket.on("reply",function(data){

    });
}