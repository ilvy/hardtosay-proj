/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 14-10-12
 * Time: 上午11:49
 * To change this template use File | Settings | File Templates.
 */
var session = require("../socket/session");

exports.router = function(app){
    app.get("/",function(req,res){
        res.send("http test");
    });

};

function addRelation(req,res){

}