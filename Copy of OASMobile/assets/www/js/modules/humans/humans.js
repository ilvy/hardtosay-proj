/**
 * Created by Administrator on 14-10-16.
 */
define("modules/humans/humans",['util','superObject','socketManager'],function(){

    var humans = superObject.extend({

        data:{},
        initialize:function(html,data){
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
                //TODO 优化 若无新数据，直接从缓存中读取
                socket.sendMessage(protocolConfig.message,{
                    sender:util.$ls("host"),
                    relative_id:relativeId
                },function(data){
                    if(data.flag == 1){
                        util.$ls("message",data.data);
                        changeHash("#message",relative);
                    }
                });

            });
        },
        renderHumans:function(){
            var data = this.data,record;
            var humanStr = "";
            for(var i = 0; i < data.length; i++){
                record = data[i];
                humanStr += '<div class="relative" data-id="'+record.relative_id+'" data-name="'+record.relative_name+'"><div class="photo" style="background-image: ../'+record.image+'">' +
                    '</div>'+record.relative_name+'</div>';
            }
            $("#content").html(humanStr);
        }
    });
    return function(html,data){
        new humans(html,data);
    }
});