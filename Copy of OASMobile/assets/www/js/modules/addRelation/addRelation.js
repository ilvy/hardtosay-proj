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
            $(".app_title").html(this.data.category);
            $("#content").on("click",".add-attention",function(){

            })
        },
        searchRelations:function(){

        }
    });
    return function(html,data){
        new addRelation(html,data);
    }
});