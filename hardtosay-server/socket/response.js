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

Response.prototype.addSocket = function(userName,socket){
    if(!this.sockets[userName]){
        this.sockets[userName] = [];
    }
    this.sockets[userName].push(socket);
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

exports.response = new Response();