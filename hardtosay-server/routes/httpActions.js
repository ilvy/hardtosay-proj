/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 14-10-12
 * Time: 上午11:49
 * To change this template use File | Settings | File Templates.
 */
var session = require("../socket/session"),
    login = require("./httpAction/login").login,
    relation = require("./httpAction/relation");

exports.router = function(app){
    app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods","POST,GET,DELETE");
        res.header("X-Powered-By",' 3.2.1')
        res.header("Content-Type", "application/json;charset=utf-8");
        next();
    });
    app.get("/",function(req,res){
        res.send("http test");
    });
    app.get("/login",login);
    app.get("/search",relation.search);
    app.get("/addRelation",relation.addRelation);
    app.get("/replyAddRelationRequest",relation.replyAddRelationRequest);
};

