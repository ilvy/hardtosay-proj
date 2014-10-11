/**
 * Created by Administrator on 14-10-11.
 */

define("modules/detailmsg/detailmsg",['util','superObject'],function(){

    var detailmsg = superObject.extend({

        initialize:function(html){
            $("#content").html(html);
        }
    })
    return function(html){
        new detailmsg(html);
    }
});