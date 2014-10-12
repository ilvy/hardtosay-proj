/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 14-10-11
 * Time: 下午9:46
 * To change this template use File | Settings | File Templates.
 */

define("modules/addRelation/addRelation",['util','superObject'],function(){

    var addRelation = superObject.extend({
        initialize:function(html){
            $("#content").html(html);
        },
        addListener:function(){
            $("#content").on("click",".add-attention",function(){

            })
        },
        searchRelations:function(){

        }
    });
    return function(html){
        new addRelation(html);
    }
});