/**
 * Created by Administrator on 14-10-11.
 */
define("modules/message/message",['util','superObject','socketManager'],function(){

    var message = superObject.extend({
        data:{},
        initialize:function(html,data){
            $("#content").html(html);
            this.data = JSON.parse(util.$ls("message"));//data;
            this.initHeader();
            this.addListener();
            this.renderMessage();
        },
        initHeader:function(){
            $(".app_title").html(this.data.name);
        },
        addListener:function(){
            var _this = this;
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
                    $('<div class="message-block spare-input right"><div class="ms-content" contenteditable="true"></div></div>').appendTo($("body"));
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
                    var contents = $content.contents().filter(function(){
                        return this.nodeType == 3;
                    }).text();
                    $content.find("> div").each(function(){
                        //TODO 过滤用户输入非法字符
                        contents += "\n"+$(this).html();
                    });
                    socket.sendMessage(protocolConfig.apology,{
                        sender:"test1",
                        receiver:_this.data.name,
                        message:contents
                    });
                    $("#add-ms-btn").css("display","block");
                    $("#send-btn").css("display","none");
                    $content.addClass("msg-display").attr("contenteditable",false);
                });
                $("#msg-list").on("click",".msg-display",function(){
                    changeHash("#detailmsg");
                });
            })
        },
        renderMessage:function(){
            var data = this.data;
            var msglistStr = '';
            for(var i = 0; i < data.length; i++){
                var record = data[i];
                msglistStr += ' <div class="message-block left" style="height:initial;"><div class="ms-content msg-display" data-type="'+record["type"]+'">' +
                    (record['message']?record['message']:"")+'</div></div>';
            }
            $("#msg-list").html(msglistStr);
        }
    });
    return function(html,data){
        new message(html,data);
    }
})