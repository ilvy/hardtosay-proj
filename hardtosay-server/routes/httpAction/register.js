/**
 * Created by Administrator on 14-11-5.
 */

var protocolConfig = require("../../socket/protocolConfig"),
    dbOperator = require("../../db/dbOperator"),
    async = require("async"),
    response = require("../response"),
    session = require("../../socket/session").session,
    userOperate = require("../../dao/useroperateDao");

/**
 * 注册：提交用户账号，密码，上传用户头像，其他都在用户信息完善界面完成
 * @param req
 * @param res
 */
exports.register = function(req,res){
    var data = req.query;
    data.name = data.user_id;
    data.image = data.image||'image/me.png';
    userOperate.register(data,function(err,results){
        if(err){
            console.log(err);
            response.failed(res,"注册失败",results);
        }else{
            response.success(res,"注册成功",{});
        }
    });
}