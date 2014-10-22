/**
 * Created by Administrator on 14-9-11.
 */

var pool = require("./dbpool").pool;

//pool.acquire(function(err, db) {
//    if (err) {
//        // handle error - this is generally the err from your
//        // factory.create function
////        console.log(err);
//    }
//    else {
//        var collection = db.collection("user");
//        collection.insert({id:"2",name:"man"},function(err,docs){
//            console.log(docs);
//            collection.count(function(err,count){
//                console.log("user count:"+count);
//            });
//            collection.find().toArray(function(err, results) {
//                console.dir(results);
//                // Let's close the db
////                pool.release(db);
//            });
//        });
//
//    }
//});

/**
 * 保存记录
 * @param table_name
 * @param obj
 * @param callback
 */
function save(table_name,obj,callback){
    pool.acquire(function(err, db) {
        if (err) {
            // handle error - this is generally the err from your
            // factory.create function
//        console.log(err);
        }
        else {
            var collection = db.collection(table_name);
            collection.insert(obj,function(err,docs){
                callback(err,docs);
                console.log(docs);
                pool.release(db);
            });
        }
    });
}

/**
 * update 记录
 * @param table_name
 * @param updatePos
 * @param updateObj
 * @param callback
 */
function update(table_name,updatePos,updateObj,callback){
    pool.acquire(function(err, db) {
        if (err) {
            // handle error - this is generally the err from your
            // factory.create function
//        console.log(err);
        }else {
            var collection = db.collection(table_name);
            collection.update(updatePos,updateObj,function(err,docs){
                callback(err,docs);
                console.log(docs);
                pool.release(db);
            });
        }
    });
}

/**
 * 查询
 * @param table_name
 * @param position
 * @param callback
 */
function select(table_name,position,sortPos,callback){
    var arguLen = arguments.length;
    pool.acquire(function(err,db){
        if(err){

        }else{
            var collection = db.collection(table_name);
            if(arguLen == 3){
                callback = sortPos;
                collection.find(position).toArray(function(err,docs){
                    if(err){
                        console.log("find err:"+err);
                    }else{
                        callback(err,docs);
                    }
                    pool.release(db);
                });
            }else if(arguLen == 4){
                collection.find(position).sort(sortPos).toArray(function(err,docs){
                    if(err){
                        console.log("find err:"+err);
                    }else{
                        callback(err,docs);
                    }
                    pool.release(db);
                });
            }

        }
    });
}

exports.save = save;
exports.select = select;
exports.update = update;