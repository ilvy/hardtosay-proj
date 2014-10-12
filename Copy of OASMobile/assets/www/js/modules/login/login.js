/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 14-10-11
 * Time: 下午11:23
 * To change this template use File | Settings | File Templates.
 */
define("modules/login/login",['util','superObject'],function(){

    var login = superObject().extend({
        initialize:function(html){
            $("#content").html(html);
        }
    });
    return function(html){
        new login(html);
    }
})