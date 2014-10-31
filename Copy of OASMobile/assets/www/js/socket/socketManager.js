/**
 * Created by Administrator on 14-9-10.
 */


function Socket(host,port,cb){
    this.socket = this.connect(host,port);
    this.protocols = {};
    this.onConnect(cb);
    this.onError();
    this.onFailed();
    this.onLogin();
//    this.onMessage();
    this.onApology();
    this.onMessageAck();
    this.onReply();
    this.onAddRelation();
}

Socket.prototype.connect = function(host,port){
    var socket = io("http://"+host+":"+port);
    return socket;
}

/**
 * socket 建立连接监听，建立连接后，发送用户socket登录请求
 * @param cb：发送用户socket登录请求函数
 */
Socket.prototype.onConnect = function(cb){
    this.socket.on("connect",function(data){
        console.log("connect:"+data);
    })
    if(cb){
        cb(this.socket);
    }
}

Socket.prototype.onError = function(){
    this.socket.on("error",function(data){
        console.log("error:"+data);
    });
}

Socket.prototype.onFailed = function(){
    this.socket.on("connect_failed",function(data){
        console.log("failed:"+data);
    })
}

Socket.prototype.sendMessage = function(event,msgObj,cb){
    this.socket.emit(event,msgObj);
    if(cb){
        socket.onMessage(event,cb);
    }
}

var socket;

//Socket.prototype.onEvent = function(){
//    this.socket.on("login",function(data){
//
//    });
//}

/**
 * 监听器
 */
Socket.prototype.onLogin = function(){
    this.socket.on("login",function(data){
        console.log(data);
        if(data.flag == 1){
            changeHash("#relative",data);
            relativeManager.classify(data.data);
//            util.$ls("humansData",data.data);
        }
    });
    this.protocols["login"] = protocolConfig.login;
}

Socket.prototype.onRegister = function(){
    this.socket.on("register",function(data){

    });
}

/**
 * 监听
 *      1、加关系请求
 *      2、对方回复请求
 */
Socket.prototype.onAddRelation = function(){
    this.socket.on("addRelation",function(data){
        var requesterInfo = data;
        if(requesterInfo.type == "request"){//别人加我的请求

        }else if(requesterInfo.type == 'reply'){//我加别人，别人的回复
            relativeManager.addRelativeSuccess(data.relative,data.relative_id,data);
            if(currentPage == 'humans'){
                $('[data-id="'+data.relative_id+'"] .waiting').remove();
            }
            //TODO 通知栏通知用户回复
            return;
        }
        if(data.status == 2){
            //TODO 说明请求被拒绝,通知栏通知
            return;
        }
        //TODO 加到用户的humans面板，并以通知栏或者红点形式提醒
        var relative = {
            relative_id:requesterInfo.user_id,
            relative_name:requesterInfo. name,
            image:requesterInfo.image,
            relative:data.relative
        };
        switch (currentPage){
            case "relative":
                //TODO 对应关系显示消息提示
//                var humansData = JSON.parse(util.$ls("humansData"));
//                if(!humansData[data.relative]){
//                    humansData[data.relative] = [];
//                }
//                humansData[data.relative].push(relative);
                $("."+requesterInfo.relative).addClass("remind-tag");
                break;
            case "humans":
                //TODO 直接添加到第一个,并修改显示样式为请求添加好友
                var newRelationMask = '';
                if(data.status == 0 && data.relativeFlag == -1){
                    newRelationMask = '<div class="newRelation"></div>';
                }
                var relativeStr = '<div class="relative" data-id="'+relative.relative_id+'" data-name="'+relative.relative_name+'">' +
                    '<div class="photo" style="background-image: ../'+relative.image+'">'+newRelationMask+'</div>'+relative.relative_name+'</div>';
                $("#content").prepend(relativeStr);
                break;
            case "message":
                //TODO 通知栏提示

                break;
        }
        relativeManager.add(data.relative,data);
    });
}

Socket.prototype.onAddRelationReply = function(){

}

Socket.prototype.onMessage = function(protocol,cb){
    if(this.isActiveProtocol(protocol)){
        return;
    }
    this.socket.on(protocol,cb);
    this.protocols[protocol] = protocol;
}

Socket.prototype.onApology = function(){
    this.socket.on(protocolConfig.apology,function(data){
        switch (currentPage){
            case "relative":
                //TODO 对应关系显示消息提示      //bug 消息缺少关系字段

                break;
            case "humans":
                //TODO 对应头像显示消息提示
                $("[data-id='"+data.receiver+"'] .photo").addClass("remind-tag");
                break;
            case "message":
                var msglistStr = "";
                msglistStr += ' <div class="message-block left" style="height:initial;overflow:initial;"><div class="ms-content msg-display"' +
                    ' data-type="'+data["type"]+'" message_id="'+data["message_id"]+'">' +
                    (data['message']?data['message']:"")+'</div><div class="msg_reply_btn_group"><div class="msg_reply_btn reply_access">接受</div>' +
                    '<div class="msg_reply_btn reply_reject">拒绝</div></div></div>';
                $("#msg-list").append(msglistStr);
                break;
        }
        msgManager.add(data.sender,data);
    });
}

Socket.prototype.onReply = function(){
    this.socket.on(protocolConfig.reply,function(data){
        switch (currentPage){
            case "relative":
                //TODO 对应关系显示消息提示
                break;
            case "humans":
                //TODO 对应头像显示消息提示
                $("[data-id='"+data.receiver+"'] .photo").addClass("remind-tag");
                break;
            case "message":
                msgManager.addReply(data.sender,data);
                var replyStr = '<div class="msg_reply_mask">'+(data.record?"原谅":"拒绝")+'</div>';
                var message_id = data.message_id;
                $('[message_id="'+message_id+'"]').append(replyStr);
                break;
        }
    });
}

/**
 * 消息发送成功应答
 */
Socket.prototype.onMessageAck = function(){
    if(this.isActiveProtocol(protocolConfig.message_ack)){
        return;
    }
    this.socket.on(protocolConfig.message_ack,function(data){
        clearTimeout(data.interval);//移除信息发送失败定时器
        $('[message_id="'+data.message_id+'"]').siblings(".sending").remove();//TODO 移除发送中的标志
    });
    this.protocols[protocolConfig.message_ack] = protocolConfig.message_ack;
}

/**
 * TODO 查询历史记录
 */

/**
 * 该协议是否已经在监听状态
 * @param protocol
 * @returns {boolean}
 */
Socket.prototype.isActiveProtocol = function(protocol){
    if(this.protocols[protocol]){
        return true;
    }
    return false;
}

/**
 * 协议配置管理
 */
var protocolConfig = {
    apology:"apology",
    message:"message",
    message_ack:"message_ack",
    reply:"reply",
    logout:"logout",
    addRelation:"addRelation"
};


$("#logout").bind("click",function(){
    var user = util.$ls("host");
    socket.sendMessage(protocolConfig.logout,{user:user});
    window.location.href = 'index.html';
})