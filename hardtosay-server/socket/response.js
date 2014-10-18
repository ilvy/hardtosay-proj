/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 14-10-6
 * Time: 上午10:35
 * To change this template use File | Settings | File Templates.
 */
function Response(){
    this.sockets = {};
}

Response.prototype.socket = function(userName,socket){
//    if(!this.sockets[userName]){
    if(arguments.length == 2){
        this.sockets[userName] = socket;
    }
    //[];
//    }
//    if(!isExistSocket(this.sockets[userName],socket)){
//        this.sockets[userName].push(socket);
//    }
    return this.sockets[userName];
}

Response.prototype.removeSocket = function(userName,socket){
    var objSockets = this.sockets[userName];
    if(objSockets && objSockets.length == 1){
        delete objSockets;
    }
    for(var i = 0; i < objSockets.length; i++){
        if(objSockets[i] == socket){
            objSockets.splice(i,i+1);
            break;
        }
    }
}

Response.prototype.send = function(userName,emit_type,results){
    var objSockets = typeof userName == 'string'?this.sockets[userName]:userName;
    objSockets.emit(emit_type,results);
//    for(var i = 0; i < objSockets.length; i++){
//        objSockets[i].emit(emit_type,results);
//    }
}

Response.prototype.success = function(userName,emit_type,results){
    var objSockets = this.sockets[userName];
    for(var i = 0; i < objSockets.length; i++){
        objSockets[i].emit(emit_type,results);
    }
}

Response.prototype.failed = function(userName,emit_type,results){
    var objSockets = this.sockets[userName];
    for(var i = 0; i < objSockets.length; i++){
        objSockets[i].emit(emit_type,results);
    }
}

/**
 * 判断该用户的是否存在同一个socket
 * @param userName
 * @param socket
 * @returns {boolean}
 */
function isExistSocket(sockets,socket){
    for(var i = 0; i < sockets.length; i++){
        if(socket == sockets[i]){
            return true;
        }
    }
    return false;
}

exports.response = new Response();