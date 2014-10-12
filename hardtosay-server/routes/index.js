
/*
 * GET home page.
 */

var http = require('http');
var path = require('path');
var socketServer = require("../socket/socket"),
    session = require("../socket/session"),
    httpRouter = require("./httpActions").router;

/**
 * 开启http路由和socket监听
 * @param app
 */
module.exports = function(app){
    httpRouter(app);

    //socket监听启动
    var server = http.createServer(app);
    socketServer(server);
    server.listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
    });
}
