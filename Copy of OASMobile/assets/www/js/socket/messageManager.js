/**
 * Created by Administrator on 14-10-21.
 * 失败消息管理器
 */
failMsgManager = {
    add:function(msg){
        var $failmsg = JSON.parse(util.$ls("failmsg"));
        if(!$failmsg){
            $failmsg = [];
        }
        $failmsg.push(msg);
        util.$ls("failmsg",$failmsg);
    },
    delete:function(message_id){
        var $failmsg = JSON.parse(util.$ls("failmsg"));
        for(var i = 0; i < $failmsg.length; i++){
            if($failmsg[i].message_id == message_id){
                $failmsg.splice(i,1);
            }
        }
        util.$ls("failmsg",$failmsg);
    },
    getAll:function(){
        var $failmsg = JSON.parse(util.$ls("failmsg"));
        return $failmsg;
    }
};

/**
 * 消息管理器
 * @type {{add: add, delete: delete, getAll: getAll, getNewestTime: getNewestTime}}
 */
msgManager = {
    /**
     * 添加数组或者单个消息记录
     * @param receiver
     * @param msgList
     */
    add:function(receiver,msgList){
        var $msg = JSON.parse(util.$ls("message"));
        if(!$msg){
            $msg = {};
        }
        if(!$msg[receiver]){
            $msg[receiver] = [];
        }
        if(msgList.length){
            [].push.apply($msg[receiver],msgList);
        }else{
            $msg[receiver].push(msgList);
        }
        util.$ls("message",$msg);
    },
    delete:function(receiver,message_id){
        var $msg = JSON.parse(util.$ls("message"));
        if(!$msg){
            $msg = {};
        }
        if(!$msg[receiver]){
            $msg[receiver] = [];
        }
        var msgs = $msg[receiver];
        for(var i = 0; i < msgs.length; i++){
            if(msgs[i] == message_id){
                msgs.splice(i,1);
            }
        }
        util.$ls("message",$msg);
    },
    getAll:function(receiver){
        var $msg = JSON.parse(util.$ls("message"));
        if(!$msg){
            $msg = {};
        }
        return $msg[receiver]?$msg[receiver]:[];
    },
    /**
     * 用以从服务端获取最新数据
     * @param receiver
     * @returns {string}
     */
    getNewestTime:function(receiver){
        var $msg = JSON.parse(util.$ls("message"));
        if(!$msg || !$msg[receiver]){
            return '1990-01-01 00:00:00';
        }
        var record = $msg.get($msg.length - 1);
        if(record.message_id){
            return util.formatDate(new Date(record.message_id,true));
        }
    },
    addReply:function(receiver,reply){
        var $msg = JSON.parse(util.$ls("message"));
        if(!$msg || !$msg[receiver]){
            return;
        }
        var msgs = $msg[receiver];
        for(var i = 0; i < msgs.length; i++){
            if(msgs[i].message_id == reply.message_id){
                msgs[i].reply = reply;
                break;
            }
        }
        util.$ls("message",$msg);
    }
}
