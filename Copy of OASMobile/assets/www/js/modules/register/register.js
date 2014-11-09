/**
 * Created by Administrator on 14-10-31.
 */
define("modules/register/register",['util','superObject','draw','touchUtil','globalManager'],function(){
    var register = superObject.extend({

        initialize:function(html){
            $("#content").html(html);
        },
        addListener:function(){
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
                })
            });
            $(".back-btn").bind("click",function(){
                changeHash("#login");
            });
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