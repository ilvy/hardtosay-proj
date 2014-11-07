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
    path = require("path"),
    formidable = require("formidable"),
    upload = require("formidable-upload");
//    uploader = upload().accept(/image*/)
//        .to(["public",'image'],'test').imguri();

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
    app.post("/uploadHeadImg",function(req,res){
        console.log(req.files);
        var ext = path.extname(req.files.file.name);
        var imageName = "test_"+new Date().getTime();
        upload().accept(/image*/)
            .to(["public",'image'],imageName).imguri().exec(req.files.file,function(err,file){
            if(err){
                console.log(err);
            }else{
                console.log(file);
            }
            res.send("http://192.168.50.216:3000/image/"+imageName+ext);
        })
    });//uploader.middleware("imagefile")
//    app.post("/uploadHeadImg",function(req,res){
//        var form = new formidable.IncomingForm();
//        form.uploadDir = './image';
//        form.parse(req,function(err,fields,files){
////            fs.renameSync(files.upload.path,"/image/test.png");
//            res.send("upload success");
//        });
//    })
//    app.post("/uploadHeadImg",function(req,res){
//        console.log(req.url+" "+req.files);
//        var form = new formidable.IncomingForm();
//        form.uploadDir = __dirname + '/';
//
//        form.on('file', function(field, file) {
//            //rename the incoming file to the file's name
//            fs.rename(file.path, "D:\\Documents\\GitHub\\hardtosay-proj\\hardtosay-server\\public\\test.jpg",function(){
//                console.log(file.path);
//            });//form.uploadDir + "/" + file.name
//        })
//            .on('error', function(err) {
//                console.log("an error has occured with form upload");
//                console.log(err);
//                req.resume();
//            })
//            .on('aborted', function(err) {
//                console.log("user aborted upload");
//            })
//            .on('end', function() {
//                console.log('-> upload done');
//            });
//
//        form.parse(req, function() {
//            res.end('photos/new');
//        });
//    })

//    app.post("/uploadHeadImg",function(req,res){
//       console.log(req.files.file);
//        var name = req.files.file.path;
//        fs.rename(name,"test.jpg",function(err){
//            console.log(err);
//        })
//    });
};

