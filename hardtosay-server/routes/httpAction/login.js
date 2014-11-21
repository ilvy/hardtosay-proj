/**
 * Created by Administrator on 2014/10/12.
 */

var protocolConfig = require("../../socket/protocolConfig"),
    dbOperator = require("../../db/dbOperator"),
    async = require("async"),
    response = require("../response"),
    session = require("../../socket/session").session,
    userOperate = require("../../dao/useroperateDao");

/**
 *
 * @param req
 * @param res
 */
exports.login = function(req,res){
    var data = req.query;
    var user = data.user;
    if(user){
        var funs = [
            isExistUser(data),
            function getHostHeader(users,cb){
                dbOperator.select("image",{user_id:user.name,status:1},function(err,results){
                    if(err){
                        console.log(err);
                    }else{
                        session.authority(user.name,user);//session记录用户登录信息
                        if(users && users.length > 0){
                            response.success(res,"login success",results.length?results[results.length - 1]:null);

                        }else{
                            response.failed(res,"login failed",{});
                        }
                    }
                    cb(null,null);
                });
            }
        ];
        async.waterfall(funs,function(err,results){
            if(err){
                return;
            }else{

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
        dbOperator.select("user",{user_id:data.user.name},function(err,results){
            cb(err,results);
        });
    }

};
