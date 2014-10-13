/**
 * Created by Administrator on 2014/10/12.
 */

var protocolConfig = require("../../socket/protocolConfig"),
    dbOperator = require("../../db/dbOperator"),
    async = require("async"),
    response = require("../response"),
    session = require("../../socket/session").session;

/**
 *
 * @param req
 * @param res
 */
exports.login = function(req,res){
    var data = req.query;
    var user = data.user;
    if(user){
        var funs = [isExistUser(data)];
        async.series(funs,function(err,results){
            if(err){
                return;
            }else{
                if(results[0] && results[0].length > 0){
                    session.authority(user.name,user);//session记录用户登录信息
                    response.success(res,"login success",{});
                }else{
                    response.failed(res,"login failed",{});
                }
            }

        });
    }
};



/**
 * 检查用户是否已经存在
 * @param cb
 */
var isExistUser = function(data){
    return function(cb){
        dbOperator.select("user",{name:data.user.name},function(err,results){
            cb(err,results);
        });
    }

};
