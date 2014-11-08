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

}