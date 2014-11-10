/**
 * Created by Administrator on 14-10-16.
 */
define("modules/humans/humans",['util','superObject','globalManager','messageManager','socketManager'],function(){

    var humans = superObject.extend({

        data:{},
        initialize:function(html,data){
            global.currentPage = "humans";
            this.data = relativeManager.getAll(currentCate);//data;
            $("#content").html(html);
            this.renderHumans();

        },
        addListener:function(){
            $(document).on("click",'.relative',function(){
                var $this = $(this);
                $this.find(".photo").removeClass("remind-tag");
                var relativeId = $this.data("id");
                var relative = {
                    id:relativeId,
                    name:$this.data("name")
                };
                global.currentTalker = relative;
                socket.sendMessage(protocolConfig.message,{
                    sender:util.$ls("host"),
                    relative_id:relativeId
//                    newestTime:msgManager.getNewestTime(relativeId)
                },function(data){
                    if(data.flag == 1){
//                        util.$ls("message",data.data);
                        if(data.data.length){
                            if(data.type == 'message'){
                                msgManager.add(relativeId,data.data);
                            }else if(data.type == 'reply'){
                                msgManager.addReply(relativeId,data.data);
                            }
                        }
                        changeHash("#message",relative);
                    }
                });
            });
            //TODO 回复同意或者拒绝，暂时直接点击同意
            $("#content").off(".newRelation")
                .on("click",".newRelation",function(event){
                    util.stopPropagation(event);
                    var sender = util.$ls("host");
                    var $this = $(this);
                    var receiver = $(this).parents(".relative").data("id");
                    var reply = 1;
                    var url = remoteServer + '/replyAddRelationRequest?sender='+sender+"&receiver="+receiver+"&reply="+reply;
                    $.ajax({
                        url:url,
                        type:"get",
                        success:function(data){
                            console.log(data);
                            if(data && data.flag == 1){
                                $this.remove();
                                relativeManager.modify(currentCate,receiver,reply);
                            }
                        },
                        error:function(err){
                            console.log(err);
                        }
                    })
                });
        },
        renderHumans:function(){
            var data = this.data,record;
            var humanStr = "",requestStr = "";
            for(var i = 0; i < data.length; i++){
                record = data[i];
                if(record.status == 0 && record.relativeFlag == -1){
                    requestStr += '<div class="relative reply-add-request" data-id="'+record.relative_id+'" data-name="'+record.relative_name+'">' +
                        '<div class="photo" style="background-image: ../'+record.image+'"><div class="newRelation"></div></div>'+record.relative_name+'</div>';
                }else if(record.status == 0 && record.relativeFlag == 1){
                    requestStr += '<div class="relative reply-add-request" data-id="'+record.relative_id+'" data-name="'+record.relative_name+'">' +
                        '<div class="photo" style="background-image: ../'+record.image+'"><div class="waiting">等待验证</div></div>'+record.relative_name+'</div>'
                }else if(record.status == 1){
                    humanStr += '<div class="relative" data-id="'+record.relative_id+'" data-name="'+record.relative_name+'"><div class="photo" style="background-image: ../'+record.image+'">' +
                        '</div>'+record.relative_name+'</div>';
                }

            }
            $("#content").html(requestStr+humanStr);
        }
    });
    return function(html,data){
//        new humans(html,data);
        if(!global.modules["humans"]){
            global.modules["humans"] = new humans(html,data);
            global.modules["humans"].addListener();
        }else{
            global.modules["humans"].initialize(html);
        }
    }
});