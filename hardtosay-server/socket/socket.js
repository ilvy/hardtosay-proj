/**
 * Created by Administrator on 14-9-10.
 */

var io;

function SocketServer(server){
    io = require("socket.io")(server);
    io.on("connection",function(socket){
        appology(socket);
    });
}

function appology(socket){
    socket.on("appology",function(data){
        console.log(data);
    });
}

module.exports = SocketServer;