
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var socketServer = require("./socket/socket");

var app = express();

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
routes(app);
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var server = http.createServer(app);
//var io = require('socket.io')(server);
//io.on("connection",function(socket){
//    console.log("a user connected");
//    socket.on("testEvent",function(data){
//        console.log(data.msg);
//    });
//})
socketServer(server);


server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
