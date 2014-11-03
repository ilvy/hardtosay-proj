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
                        console.log(data);
                        if(data.flag){
                            util.$ls("host",name);
                            socket = new Socket("localhost",5000,function(socket){
                                socket.emit("login",{user:{name:name}});
                            });
                        }
                    },
                    error:function(err){
                        console.log(err);
                    }
                })
            });
            $(document).on("click","#regBtn",function(){
                var name = $("#username").val(),
                    pwd = $("#password").val();
                var url = remoteServer + "/register";
                var data = {

                }
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