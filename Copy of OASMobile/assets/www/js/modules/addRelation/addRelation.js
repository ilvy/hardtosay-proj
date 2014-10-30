/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 14-10-11
 * Time: 下午9:46
 * To change this template use File | Settings | File Templates.
 */

define("modules/addRelation/addRelation",['util','superObject'],function(){

    var addRelation = superObject.extend({
        data:{},
        initialize:function(html,data){
            currentPage = "addRelation";
            $("#content").html(html);
            this.data = data;
            this.addListener();
        },
        addListener:function(){
            var _this = this;
            $(".app_title").html(this.data.category);
            $("#content").on("click","#search-user",function(){
                _this.searchRelations();
            });
            $("#content").on("click",".add-att-btn",function(){
                var $this = $(this);
                var user2 = $(this).parents(".search-record").data("userid");
                var user1 = util.$ls("host");
                var relative = _this.data.category;
                var url = remoteServer+"/addRelation?user1="+user1+"&user2="+user2+"&relative="+relative;
                $.ajax({
                    url:url,
                    type:"get",
                    success:function(data){
                        console.log(data);
                        if(data.flag == 1){
                            $this.val("请求已经发送").removeClass(".add-att-btn");
                        }
                    },
                    error:function(err){
                        console.log(err);
                    }
                })
            });
        },
        searchRelations:function(){
            var _this = this;
            var search_key = $(".search-input").val();
            var host = util.$ls("host");
            var url = remoteServer+'/search?search_key='+search_key+'&user='+host;
            $.ajax({
                url:url,
                type:"get",
                success:function(data){
                    console.log(data);
                    if(data && data.flag == 1){
                        data = data.results;
                        _this.renderUsers(data);
                    }
                },
                error:function(err){
                    console.log(err);
                }
            })
        },
        renderUsers:function(data){
            var listStr = "";
            for(var i = 0; i < data.length; i++){
                var record = data[i];
                listStr += '<div class="search-record" data-userid="'+record.user_id+'"><div class="sr-head-icon sr-row"></div><div class="sr-name sr-row">'+record.name+'</div>' +
                    '<div class="sr-desc sr-row"><input type="button" class="add-attention add-att-btn" value="加关注"/></div></div></div>';
            }
            $(".search-list").html(listStr);
        }
    });
    return function(html,data){
        new addRelation(html,data);
    }
});