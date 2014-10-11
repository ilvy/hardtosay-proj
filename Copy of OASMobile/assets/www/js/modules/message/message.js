/**
 * Created by Administrator on 14-10-11.
 */
define("modules/message/message",['util','superObject'],function(){

    var message = superObject.extend({

        initialize:function(html){
            $("#content").html(html);
            this.initHeader();
            this.addListener();
        },
        initHeader:function(){
            $(".app_title").html("开口...");
        },
        addListener:function(){
            $(function(){
                $("#add-ms-btn").css({
                    left:(wW - $("#add-ms-btn").width()) / 2
                });
                $("#send-btn").css({
                    left:(wW - $("#send-btn").width()) / 2
                });
                $("#add-ms-btn").wheelmenu({
                    trigger: "click",
                    animation: "fly",
                    animationSpeed: "fast"
                });
                $("#wheel").on("click",".item",function(){
                    var $this = $(this);
                    var action = $this.data("action");
                    $(".spare-input").data("action",action).removeClass("spare-input").appendTo($(".msg-list"));
                    $('<div class="message-block spare-input left"><div class="ms-content" contenteditable="true"></div></div>').appendTo($("body"));
                    $("html,body").animate({
                        scrollTop:$("body").height()
                    },1000);
                    $("#add-ms-btn").click().css("display","none");
                    $("#send-btn").css("display","block");
                });
                /*
                 *发送消息
                 */
                $("#send-btn").on("click",function(){
                    var $content = $("#msg-list .message-block:last .ms-content");
                    var paras = $content.contents().filter(function(){
                        return this.nodeType == 3;
                    }).text();
                    $content.find("> div").each(function(){
                        //TODO 过滤用户输入非法字符
                        paras += "\n"+$(this).html();
                    });
                    //alert(paras);
                    $("#add-ms-btn").css("display","block");
                    $("#send-btn").css("display","none");
                    $content.addClass("msg-display").attr("contenteditable",false);
                });
                $("#msg-list").on("click",".msg-display",function(){
                    changeHash("#detailmsg");
                });
            })
        }
    });
    return function(html){
        new message(html);
    }
})