/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 14-10-5
 * Time: 下午12:19
 * To change this template use File | Settings | File Templates.
 */

var mongodb = require('mongodb'),
    MongoClient = mongodb.MongoClient,
    db;

var server = new mongodb.Server("127.0.0.1",27017,{});//本地27017端口

new mongodb.Db('test',server,{}).open(function(error,client){//数据库：mongotest
    if(error) throw error;
    var collection = new mongodb.Collection(client,'user');//表：user
    collection.insert({id:2,name:"man"},function(err,docs){
        if(err){
            console.log("err:"+err);
            return;
        }
        console.log(docs);
    });
});

//MongoClient.connect("mongodb://localhost/test?maxPoolSize=10",function(){
//
//});