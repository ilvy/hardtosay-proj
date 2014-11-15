/**
 * Created by Administrator on 14-10-21.
 * 失败消息管理器
 */
failMsgManager = {
    $failmsgs:null,
    add:function(msg){
        var $failmsg = this.getByHost();
        if(!$failmsg){
            $failmsg = [];
        }
        $failmsg.push(msg);
        util.$ls("failmsg",this.$failmsgs);
    },
    delete:function(message_id){
        var $failmsg = this.getByHost();
        for(var i = 0; i < $failmsg.length; i++){
            if($failmsg[i].message_id == message_id){
                $failmsg.splice(i,1);
            }
        }
        util.$ls("failmsg",this.$failmsgs);
    },
    getAll:function(){
        var $failmsg = this.getByHost();
        return $failmsg;
    },
    getByHost:function(){
        var host = util.$ls("host");
        this.$failmsgs = JSON.parse(util.$ls("failmsg"));
        if(!this.$failmsgs){
            this.$failmsgs = {};
        }
        return this.$failmsgs[host]?this.$failmsgs[host]:this.$failmsgs[host] = {};
    }
};

/**
 * 消息管理器
 * @type {{add: add, delete: delete, getAll: getAll, getNewestTime: getNewestTime, addReply: addReply}}
 */
msgManager = {
    $message:null,
    /**
     * 添加数组或者单个消息记录
     * @param receiver
     * @param msgList
     */
    add:function(receiver,msgList){
        var $msg = this.getMessageByHost();
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
        util.$ls("message",this.$message);
    },
    delete:function(receiver,message_id){
        var $msg = this.getMessageByHost();
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
        util.$ls("message",this.$message);
    },
    getAll:function(receiver){
        var $msg = this.getMessageByHost();
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
        var $msg = this.getMessageByHost();
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
        util.$ls("message",this.$message);
    },
    getMessageByHost:function(){
        this.$message = util.$ls("message")?JSON.parse(util.$ls("message")):{};
        if(!this.$message){
            this.$message = {};
        }
        var host = util.$ls("host");
        var $msg = this.$message[host];
        return $msg?$msg:$msg = this.$message[host] = {};
    }
}

/**
 * 关系数据管理
 * @type {{classify: classify, add: add, addRelativeSuccess: addRelativeSuccess, getAll: getAll}}
 */
var relativeManager = {
    $humansDatas:null,
    classify:function(data){
        var $humansData = {};
        for(var i = 0; i < data.length; i++){
            var relative = data[i]["relative"];

            if(!$humansData[relative]){
                $humansData[relative] = [];
            }
            $humansData[relative].push(data[i]);
        }
        util.$ls("humansData",$humansData);
    },
    add:function(cate,msgList){
        var $humansData = this.getByHost();//JSON.parse(util.$ls("humansData"));
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
        var $humansData = this.getByHost();//JSON.parse(util.$ls("humansData"));
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
        util.$ls("humansData",$humansData);
    },
    getAll:function(category){
        var $humansData = this.getByHost();//JSON.parse(util.$ls("humansData"));
        if(!$humansData){
            $humansData = {};
        }
        return $humansData[category];
    },
    modify:function(cate,receiver,reply){
        var $humansData = this.getByHost();//JSON.parse(util.$ls("humansData"));
        if(!$humansData || !$humansData[cate]){
            return;
        }
        var $data = $humansData[cate];
        for(var i = 0; i < $data.length; i++){
            if($data[i]["receiver"] = receiver){
                if(reply == 1){
                    $data[i]["receiver"].status = 1;
                }else{
                    $data[i]["receiver"].status = 2;
                }
                break;
            }
        }
        util.$ls("humansData",$humansData);
    },
    getByHost:function(){
        return this.$humansDatas = util.$ls("humansData")?JSON.parse(util.$ls("humansData")):{};
//        if(!this.$humansDatas){
//            this.$humansDatas = {};
//        }
//        var host = util.$ls("host");
//        return this.$humansDatas[host];
    }
}

var dataManager = {
    getAsJSON:function(user_id,key){
        var data = util.$ls(key)?JSON.parse(util.$ls(key)):{};
        if(data[user_id]){
            return data[user_id];
        }else{
            return 0;
        }
//        return data[user_id]?data[user_id]:0;
    },
    addAsJSON:function(user_id,key,obj){
        var data = util.$ls(key)?JSON.parse(util.$ls(key)):{};
        if(!data[user_id]){
            data[user_id] = {};
        }
        data[user_id] = obj;
        util.$ls(key,data);
        return true;
    }
}