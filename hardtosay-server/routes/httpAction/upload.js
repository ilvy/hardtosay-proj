/**
 * Created by Administrator on 14-11-11.
 */

var path = require("path"),
    upload = require("formidable-upload"),
    dbOperator = require("../../db/dbOperator"),
    response = require("../response");

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
    dbOperator.save('image',imagePos,function(err,results){
        if(err){
            console.log(err);
        }else{
            response.success(res,"确定头像位置成功",{});
        }
    });
}