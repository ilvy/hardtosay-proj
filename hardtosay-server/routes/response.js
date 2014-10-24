/**
 * Created by Administrator on 14-10-13.
 */

function Response(){

}

Response.prototype.success = function(res,msg,results){
    if(!results){
        results = [];
    }
    res.send({
        flag:1,
        msg:msg,
        results:results
    })
}


Response.prototype.failed = function(res,msg,results){
    res.send({
        flag:0,
        msg:msg,
        results:results
    })
}

module.exports = new Response();