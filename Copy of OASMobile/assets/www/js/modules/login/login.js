/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 14-10-11
 * Time: 下午11:23
 * To change this template use File | Settings | File Templates.
 */
define("modules/login/login",['util','superObject','messageManager','socketManager','globalManager'],function(){

    var login = superObject.extend({
        initialize:function(html){
            $("#content").html(html);
        },
        addListener:function(){
            $(document).on("click","#loginBtn",function(){
                var name = $("#username").val(),
                    pwd = $("#password").val();
                var url = remoteServer+"/login";
                var data = {
                    user:{
                        name:name,
                        pwd:pwd
                    }
                }
                $.ajax({
                    url:url,
                    data:data,
                    type:"get",
                    success:function(data){
                        console.log("flag:"+data.flag);
                        if(data.flag){
                            var headImg = data.results;
                            dataManager.addAsJSON(name,"headImg",headImg);//用户头像数据
                            util.$ls("host",name);
                            socket = new Socket(serverConfig.ip,5000,function(socket){
                                socket.emit("login",{user:{name:name}});
                                if(typeof cordova != "undefined"){
                                    cordova.exec(function(success){
                                        alert(success);
                                    },function(failed){
                                        alert(failed);
                                    },"SetAlias","setAlias",name);
                                }
                            });
                        }
                    },
                    error:function(err){
                        console.log(err);
                    }
                })
            });
            $(document).on("click","#toReg",function(){
                changeHash("#register");
            });
        }
    });
    return function(html){
//        new login(html);
        if(!global.modules["login"]){
            global.modules["login"] = new login(html);
            global.modules["login"].addListener();
        }else{
            global.modules["login"].initialize(html);
        }
    }
})