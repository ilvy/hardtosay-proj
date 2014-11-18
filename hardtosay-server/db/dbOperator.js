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
            collection.update(updatePos,updateObj,{safe:true,multi:true},function(err,docs){
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
function select(table_name,position,extraPos,callback){
    var arguLen = arguments.length;
    pool.acquire(function(err,db){
        if(err){

        }else{
            var collection = db.collection(table_name);
            if(arguLen == 3){
                callback = extraPos;
                collection.find(position).toArray(function(err,docs){
                    if(err){
                        console.log("find err:"+err);
                    }else{
                        callback(err,docs);
                    }
                    pool.release(db);
                });
            }else if(arguLen == 4){
                var sortPos = extraPos.sort?extraPos.sort:{},
                    fieldsPos = extraPos.fieldsPos?extraPos.fieldsPos:{};
                collection.find(position,fieldsPos).sort(sortPos).toArray(function(err,docs){
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

/**
 *
 * @param dbref
 * @param cb
 */
function dereference(dbref,cb){
    pool.acquire(function(err,db){
        if(err){

        }else{
            db.dereference(dbref,cb);
            pool.release(db);
        }
    });
}

function selectMessagewidthReply(position,sortPos,callback){
    pool.acquire(function(err,db){
        if(err){

        }else{
            var collection = db.collection("message");
            var cursor = collection.find(position).sort(sortPos);
            var obj = {};
            var results = [];
            var replyColl = db.collection("reply");
//            while(obj = cursor.next()){
            cursor.toArray(function(err,results){
                for(var i = 0; i < results.length; i++){
                    var obj = results[i];
                    replyColl.find({message_id:obj.message_id,sender:obj.sender,receiver:obj.receiver}).toArray(function(err,docs){
                        if(err){
                            console.log("get reply err:"+err);
                        }else{
                            if(docs.length > 0){
                                obj.reply = docs[0];
                            }
                        }
                    })
                }

            })


            callback(err,results);
            pool.release(db);

        }
    });
}

exports.save = save;
exports.select = select;
exports.update = update;
exports.selectMessagewidthReply = selectMessagewidthReply;
exports.dereference = dereference;