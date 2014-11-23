/**
 * Created by Administrator on 14-11-11.
 */

var path = require("path"),
    upload = require("formidable-upload"),
    dbOperator = require("../../db/dbOperator"),
    response = require("../response"),
    async = require("async");

exports.uploadImg = function(req,res){
    console.log(req.files);
    var ext = path.extname(req.files.file.name);
    var imageName = "test_"+new Date().getTime();
    upload().accept(/image*/)
        .to(["public",'image'],imageName).imguri().exec(req.files.file,function(err,file){
            if(err){
                console.log(err);
            }else{
//                console.log(file);
                console.log("success");
            }
            res.send("image/"+imageName+ext);
        })
}

exports.updateImgPosition = function(req,res){
    var body = req.body;
    var imagePos = {
        user_id:body.user_id,
        baseSize:body.baseSize,
        left:body.left,
        top:body.top,
        type:body.type,
        path:body.path
    }
    /**
     * 覆盖原头像
     */

    var funs = [
        function deleteOldImg(cb){
            dbOperator.update("image",{user_id:imagePos.user_id,status:1},{$set:{status:0}},function(err,results){
                cb(err,results);
            })
        },
        (function(){
            return function saveNewImg(delResults,cb){
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
        })(),
        //添加headimg
        function addRefToRelative(saveResults,cb){
            if(saveResults && saveResults.length){
                dbOperator.update("relative",{relative_id:data.user_id},{$set:{image:new DBRef("image",saveResults[0]._id)}},function(err,results){
                    if(err){
                        console.log(err);
                    }else{

                    }
                    cb(err,saveResults);
                })
            }
            cb(null,saveResults)
        },
        function addRefToUser(saveResults,cb){
            if(saveResults && saveResults.length){
                dbOperator.update("user",{user_id:data.user_id},{$set:{image:new DBRef("image",saveResults[0]._id)}},function(err,results){
                    if(err){
                        console.log(err);
                    }else{

                    }
                    cb(err,saveResults);
                });
                cb(null,saveResults);
            }
        }];
    async.waterfall(funs,function(err,results){
        if(err){
            response.failed(res,"上传失败",results);
        }else{
            response.success(res,"上传成功",results);
        }
    });
}