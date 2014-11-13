/**
 * Created by Administrator on 14-11-11.
 */

var path = require("path"),
    upload = require("formidable-upload");

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
            res.send("http://192.168.50.216:3000/image/"+imageName+ext);
        })
}

exports.updateImgPosition = function(req,res){

}