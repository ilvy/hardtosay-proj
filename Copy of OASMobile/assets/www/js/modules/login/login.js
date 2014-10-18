/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 14-10-11
 * Time: 下午11:23
 * To change this template use File | Settings | File Templates.
 */
define("modules/login/login",['util','superObject','socketManager'],function(){

    var login = superObject.extend({
        initialize:function(html){
            $("#content").html(html);
            this.addListener();
        },
        addListener:function(){
            $(document).on("click","#loginBtn",function(){
                var name = $("#username").val(),
                    pwd = $("#password").val();
                var url = "http://localhost:5000/login";
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
                        util.$ls("host",name);
                        if(data.flag){
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
        }
    });
    return function(html){
        new login(html);
    }
})