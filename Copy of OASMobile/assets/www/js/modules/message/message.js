/**
 * Created by Administrator on 14-10-11.
 */
define("modules/message/message",['util','superObject','messageManager','socketManager','globalManager'],function(){

    var message = superObject.extend({
        data:{},
        relative:{},
        initialize:function(html,data){
            global.currentPage = "message";
            $("#content").html(html);
            this.relative = global.currentTalker;
            this.data = msgManager.getAll(this.relative.id);//data;
            this.initHeader();
            this.renderMessage();
        },
        initHeader:function(){
            $(".app_title").html(this.relative.name);
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
                    var message_id = new Date().getTime();//以时间戳标示发出信息，用于服务端应答该信息
                    var msgObj = {
                        sender:util.$ls("host"),
                        receiver:_this.relative.name,
                        message:contents,
                        message_id:message_id,
                        relative:currentCate
                    };
                    msgManager.add(_this.relative.id,msgObj);//缓存发送消息
                    msgObj.interval = setTimeout(function(){
                        $("[message_id='"+message_id+"']").addClass("exlamation").siblings(".sending").remove();
                        msgObj.status = 0;//标记缓存中的信息为发送失败状态
                    },15*1000);//设置15s发送失败
                    socket.sendMessage(protocolConfig.apology,msgObj);
                    $("#add-ms-btn").css("display","block");
                    $("#send-btn").css("display","none");
                    $content.addClass("msg-display").attr("contenteditable",false).attr("message_id",message_id);
                    $("#msg-list .message-block:last").css({
                        height:"initial",
                        "overflow-y":"initial"
                    }).append('<span class="icon-spinner icon-spin sending"></span>');
                });
                $("#msg-list").on("click",".msg-display",function(){
                    changeHash("#detailmsg");
                });
                $('#msg-list').on("click",'.msg_reply_btn',function(event){
                    var $this = $(this);
                    var replyObj = {};
                    replyObj.message_id = $this.parents(".message-block").find("[message_id]").attr("message_id");
                    replyObj.sender = util.$ls("host");
                    replyObj.receiver = _this.relative.id;
                    replyObj.type = $this.parents(".message-block").find(".ms-content").data("type");
                    replyObj.relative = currentCate;
                    if($this.hasClass("reply_access")){
                        replyObj.reply = 1;
                    }else if($this.hasClass("reply_reject")){
                        replyObj.reply = 0;
                    }
                    socket.sendMessage(protocolConfig.reply,replyObj);
                });
            })
        },
        renderMessage:function(){
            var data = this.data;
            var msglistStr = '',replyStr = '';
            for(var i = 0; i < data.length; i++){
                replyStr = "";
                var record = data[i],replyBtns = "",reply = record.reply;
                var posClass = record["receiver"] == this.relative.name?
                    (replyStr = (reply?'<div class="msg_reply_mask">'+(reply.reply?"原谅":"拒绝")+'</div>':''),"right"):
                    (replyBtns = '<div class="msg_reply_btn_group"><div class="msg_reply_btn reply_access">接受</div>' +
                        '<div class="msg_reply_btn reply_reject">拒绝</div></div>',"left");

                msglistStr += ' <div class="message-block '+posClass+'" style="height:initial;overflow:initial;">' +
                    '<div class="ms-content msg-display" data-type="'+record["type"]+'" message_id="'+record["message_id"]+'">' +
                    (record['message']?record['message']:"")+replyStr+'</div>'+replyBtns+'</div>';
            }
            $("#msg-list").html(msglistStr);
        }
    });
    return function(html,data){
//        new message(html,data);
        if(!global.modules["message"]){
            global.modules["message"] = new message(html,data);
            global.modules["message"].addListener();
        }else{
            global.modules["message"].initialize(html);
        }
    }
})