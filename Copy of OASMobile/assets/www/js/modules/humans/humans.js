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
            $("#content").on("click",'.waiting',function(event){
                util.stopPropagation(event);
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
//        backgroundImage:'url('+remoteServer+'/'+headImgObj.path+')',
//        backgroundSize:headImgObj.baseSize * ratio,
//        'background-position-y':-headImgObj.top * ratio+"px",
//        'background-position-x':-headImgObj.left * ratio+"px",
//        backgroundRepeat:'no-repeat'
        renderHumans:function(){
            var data = this.data,record;
            var humanStr = "",requestStr = "";
            var ratio;
            for(var i = 0; i < data.length; i++){
                record = data[i];
                if(typeof record.image == 'object'){
                    var imageObj = record.image;
                    if(!ratio){
                        ratio = 66 / imageObj.baseSize; //TODO 头像框大小不能定死
                    }
                    var headImgStyle = 'background-image:url('+remoteServer+"/"+imageObj.path+');background-size:'+imageObj.baseSize * ratio+'px;background-position-y：'
                            +(-imageObj.top * ratio)+"px;background-position-x:"+(-imageObj.left * ratio)+'px;background-repeat:no-repeat';
                }else{
                    headImgStyle = 'background-image: ../'+record.image+'';
                }
                if(record.status == 0 && record.relativeFlag == -1){
                    requestStr += '<div class="relative reply-add-request" data-id="'+record.relative_id+'" data-name="'+record.relative_name+'">' +
                        '<div class="photo" style="'+headImgStyle+'"><div class="newRelation"></div></div>'+record.relative_name+'</div>';
                }else if(record.status == 0 && record.relativeFlag == 1){
                    requestStr += '<div class="relative reply-add-request" data-id="'+record.relative_id+'" data-name="'+record.relative_name+'">' +
                        '<div class="photo" style="'+headImgStyle+'"><div class="waiting">等待验证</div></div>'+record.relative_name+'</div>'
                }else if(record.status == 1){
                    humanStr += '<div class="relative" data-id="'+record.relative_id+'" data-name="'+record.relative_name+'">' +
                        '<div class="photo" style="'+headImgStyle+'">' +
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