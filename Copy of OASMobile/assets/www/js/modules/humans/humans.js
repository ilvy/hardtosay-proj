/**
 * Created by Administrator on 14-10-16.
 */
define("modules/humans/humans",['util','superObject','messageManager','socketManager'],function(){

    var humans = superObject.extend({

        data:{},
        initialize:function(html,data){
            currentPage = "humans";
            this.data = JSON.parse(util.$ls("humanspage"));//data;
            $("#content").html(html);
            this.addListener();
            this.renderHumans();

        },
        addListener:function(){
            $(document).on("click",'.relative',function(){
                var $this = $(this);
                var relativeId = $this.data("id");
                var relative = {
                    id:relativeId,
                    name:$this.data("name")
                };

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
                    var receiver = $(this).parents(".relative").data("id");
                    var reply = 1;
                    var url = remoteServer + '/replyAddRelationRequest?sender='+sender+"&receiver="+receiver+"&reply="+reply;
                    $.ajax({
                        url:url,
                        type:"get",
                        success:function(data){
                            console.log(data);
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
                }else{
                    humanStr += '<div class="relative" data-id="'+record.relative_id+'" data-name="'+record.relative_name+'"><div class="photo" style="background-image: ../'+record.image+'">' +
                        '</div>'+record.relative_name+'</div>';
                }

            }
            $("#content").html(requestStr+humanStr);
        }
    });
    return function(html,data){
        new humans(html,data);
    }
});