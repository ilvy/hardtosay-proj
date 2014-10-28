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
 * @type {{add: add, delete: delete, getAll: getAll, getNewestTime: getNewestTime, addReply: addReply}}
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
        if(reply.length){
            for(var i = 0; i < reply.length; i++){
                for(var j = 0; j < msgs.length; j++){
                    if(msgs[j].message_id == reply[i].message_id){
                        msgs[j].reply = reply[i];
                        break;
                    }
                }
            }
            util.$ls("message",$msg);
            return;
        }
        for(var i = 0; i < msgs.length; i++){
            if(msgs[i].message_id == reply.message_id){
                msgs[i].reply = reply;
                break;
            }
        }
        util.$ls("message",$msg);
    }
}

/**
 * 关系数据管理
 * @type {{classify: classify, add: add, addRelativeSuccess: addRelativeSuccess}}
 */
var relativeManager = {
    classify:function(){

    },
    add:function(cate,msgList){
        var $humansData = JSON.parse(util.$ls("humansData"));
        if(!$humansData){
            $humansData = {};
        }
        if(!$humansData[cate]){
            $humansData[cate] = [];
        }
        if(msgList.length){
            [].push.apply($humansData[cate],msgList);
        }else{
            $humansData[cate].push(msgList);
        }
        util.$ls("humansData",$humansData);
    },
    /**
     * 添加关系成功，更新缓存数据
     * @param cate
     * @param receiver
     * @param obj
     */
    addRelativeSuccess:function(cate,receiver,obj){
        var $humansData = JSON.parse(util.$ls("humansData"));
        if(!$humansData || !$humansData[cate]){
            return;
        }
        var $data = $humansData[cate];
        for(var i = 0; i < $data.length; i++){
            if($data[i]["receiver"] = receiver){
                $data[i]["receiver"] = obj;
                break;
            }
        }
    }
}