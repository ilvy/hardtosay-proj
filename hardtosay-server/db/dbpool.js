/**
 * Created by Administrator on 14-9-11.
 */

var poolModule = require("generic-pool"),
    mongodb = require("mongodb");

var pool = poolModule.Pool({
    name:'mongodb',
    create:function(callback){
        var server_options = {auto_reconnect:false,poolSize:10};
        var db_options = {};
        var mongoserver = new mongodb.Server('localhost',27017,server_options);
        var db = new mongodb.Db('test',mongoserver,db_options);
        db.open(function(err,db){
            if(err){
                return callback(err);
            }
            callback(null,db);
        });

    },
    destroy:function(db){
        db.close();
    },
    max:10,
    min:2,
    idleTimeoutMillis:15000,
    log:true
});

exports.pool = pool;
