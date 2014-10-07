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

Socket.prototype.onEvent = function(){
    this.socket.on("login",function(data){

    });
}