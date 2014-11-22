/**
 * Created by Administrator on 14-10-31.
 */
define("modules/register/register",['util','superObject','draw','touchUtil','globalManager','lightPlugins'],function(){
    var register = superObject.extend({

        initialize:function(html){
            $("#content").html(html);
        },
        addListener:function(){
            var _this = this;
            $("#content").on("click","#regBtn",function(event){
                var userId = $("#username").val(),
                    pwd = $("#password").val();
                var confirmPwd = $("#confirm").val();
                if(pwd != confirmPwd){
                    alert("请确认密码");
                    return;
                }
                var url = remoteServer + "/register?user_id="+userId + "&pwd=" + pwd;
                $.ajax({
                    url:url,
                    type:"post",
                    data:global.headerImgPos,
                    success:function(results){
                        if(results && results.flag == 1){
                            changeHash("#login");
                        }else{
                            alert("注册失败");
                        }
                    },
                    error:function(err){
                        console.log(err);
                    }
                });

            });
            $("#content").on("click","#upload",function(){
                _this.getPicture();
            });
            $(".back-btn").bind("click",function(){
                changeHash("#login");
            });
        },
        upload:function(imgUrl){
            var _this = this;
            var options = new FileUploadOptions();

            options.fileKey = "file";//用于设置参数，对应form表单里控件的name属性，这是关键，废了一天时间，完全是因为这里，这里的参数名字，和表单提交的form对应
            options.type = "image/jpeg";
    //        var imagefilename = Number(new Date())+".jpg";
            var fileName=imgUrl.substr(imgUrl.lastIndexOf('/') + 1);
            options.fileName = fileName.indexOf(".") > -1?fileName:fileName+".jpg";
            //options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);

            //如果是图片格式，就用image/jpeg，其他文件格式上官网查API
    //        options["form-data"] =
            options.mimeType = "image/jpeg";

    //        options.mimeType = "multipart/form-data";//这两个参数修改了，后台就跟普通表单页面post上传一样 enctype="multipart/form-data"

            //这里的uri根据自己的需求设定，是一个接收上传图片的地址

            var uri = encodeURI(remoteServer+"/uploadHeadImg");

            //alert(imageURI);

            //alert(uri);

            options.chunkedMode = false;

            var params = new Object();

            params.fileAddPic = imgUrl;

            options.params = params;

            var ft = new FileTransfer();

            ft.upload(imgUrl, uri, success, fail, options);

            ft.onprogress = function(progressEvent){//上传进度
                var loaded = Number(progressEvent.loaded),
                    total = progressEvent.total;
                if(progressEvent.lengthComputable){
                    _this.uploadingProgress(loaded / total);
                }else{

                }
            }

            function success(data){
                console.log("upload success :"+data.response);
                var url = remoteServer + "/" +data.response;
                _this.uploadingProgress(1)
                $("#updateImgPos").css("display","block");
                var wW = $(window).width(),
                    wH = $(window).height();
                $(".photo-frame").css({
                    top:(wH - $(".photo-frame").height()) / 2,
                    left:(wW - $(".photo-frame").width()) / 2
                });
                $(".photo-carrier").css({
                    top:(wH - $(".photo-carrier").height()) / 2,
                    left:(wW - $(".photo-carrier").width()) / 2
                });
                $(".photo-carrier img").attr("src",url);
                $(".photo-carrier").drag(data.response);
            }
            function fail(){//TODO 提示上传失败
                console.log("upload fail :");
                _this.uploadingProgress(1);
                navigator.notification.alert("上传图片失败,请重试！",function(){

                },"上传失败","OK");
            }
        },
        getPicture:function(){
            var _this = this;
            var option = {
                quality:80,
                destinationType:Camera.DestinationType.FILE_URI,
                sourceType:Camera.PictureSourceType.PHOTOLIBRARY,
                encodingType:Camera.EncodingType.JPEG
            };
            navigator.camera.getPicture(function(data){
                _this.upload(data);
            },function(err){
                console.log(err);
            },option);
        },
        uploadingProgress:function(status){
            if(status == 1){
                $("#uploading-mask").css("display","none");
            }else{
                $("#uploading-mask").css("display","block");
            }
        }
    });
    return function(html){
        if(!global.modules["register"]){
            global.modules["register"] = new register(html);
            global.modules["register"].addListener();
        }else{
            global.modules["register"].initialize(html);
        }
    }
});