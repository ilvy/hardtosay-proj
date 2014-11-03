/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 14-10-12
 * Time: 上午11:49
 * To change this template use File | Settings | File Templates.
 */
var session = require("../socket/session"),
    login = require("./httpAction/login").login,
    relation = require("./httpAction/relation"),
    fs = require("fs"),
    formidable = require("formidable"),
    upload = require("formidable-upload"),
    uploader = upload().accept(/image*/)
        .to(["public",'image']).imguri();

exports.router = function(app){
    app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods","POST,GET,DELETE");
        res.header("X-Powered-By",' 3.2.1')
        res.header("Content-Type", "application/json;charset=utf-8");
        next();
    });
    app.get("/",function(req,res){
        res.send("http test");
    });
    app.get("/login",login);
    app.get("/search",relation.search);
    app.get("/addRelation",relation.addRelation);
    app.get("/replyAddRelationRequest",relation.replyAddRelationRequest);
//    app.post("/uploadHeadImg",function(req,res){
//        console.log(req);
//        uploader.exec(req.files.upload,function(err,file){
//            if(err){
//                console.log(err);
//            }else{
//                console.log(file);
//            }
//        })
//    });//uploader.middleware("imagefile")
    app.post("/uploadHeadImg",function(req,res){
        var form = new formidable.IncomingForm();
        form.uploadDir = './image';
        form.parse(req,function(err,fields,files){
//            fs.renameSync(files.upload.path,"/image/test.png");
            res.send("upload success");
        });
    })
};

