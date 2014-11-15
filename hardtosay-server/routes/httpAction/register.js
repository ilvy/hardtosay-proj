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
    var data = req.query,
        body = req.body;
    data.name = data.user_id;
    data.image = data.image||'image/me.png';
    /**
     * 记录用户对应头像数据
     */
    var funs = [];
    if(body && body.path){
        var imagePos = {
            user_id:data.user_id,
            baseSize:body.baseSize,
            left:body.left,
            top:body.top,
            type:body.type,
            path:body.path,
            status:1
        }
        /**
         * 覆盖原头像
         */

        funs = [
            function deleteOldImg(cb){
                dbOperator.update("image",{user_id:data.user_id,status:1},{$set:{status:0}},function(err,results){
                    cb(err,results);
                })
            }
        ];
    }
    funs.push(
        (function(){
            return function saveNewImg(cb){
                dbOperator.save('image',imagePos,function(err,results){
                    if(err){
                        console.log(err);
                    }else{
//                    response.success(res,"确定头像位置成功",{});
                        console.log('确定头像位置成功');
                    }
                    cb(err,results);
                });
            }
        })()
        );
    async.series(funs,function(err,results){
        userOperate.register(data,function(err,results){
            if(err){
                console.log(err);
                response.failed(res,"注册失败",results);
            }else{
                response.success(res,"注册成功",{});
            }
        });
    });

}