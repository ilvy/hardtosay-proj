/**
 * Created by Administrator on 14-10-31.
 */
define("modules/register/register",['util','superObject','draw','touchUtil'],function(){
    var register = superObject.extend({

        initialize:function(html){
            $("#content").html(html);
        }
    });
    return function(html){
        new register(html);
    }
});