/**
 * Created by Administrator on 14-9-11.
 */

var pool = require("./dbpool").pool;

pool.acquire(function(err, db) {
    if (err) {
        // handle error - this is generally the err from your
        // factory.create function
//        console.log(err);
    }
    else {
        var collection = db.collection("user");
        collection.insert({id:"2",name:"man"},function(err,docs){
            console.log(docs);
            collection.count(function(err,count){
                console.log("user count:"+count);
            });
            collection.find().toArray(function(err, results) {
                console.dir(results);
                // Let's close the db
                pool.release(db);
            });
        });

    }
});

