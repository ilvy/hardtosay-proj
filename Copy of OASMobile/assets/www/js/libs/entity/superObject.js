/**
 * Created with JetBrains WebStorm.
 * User: xuefeng.jiang
 * Date: 14-2-20
 * Time: 下午12:06
 * To change this template use File | Settings | File Templates.
 */
(function($){
    function superObject(){

    }
    superObject.extend = function(obj){
        var subObj = null;
        var Class = function(argu,data){
            this.initialize.apply(this,arguments);
        };
        Class.prototype = {
            initialize:function(argu){

            }
        }
        if(typeof obj == "object"){
            subObj = util._extend(Class.prototype,superObject.prototype,obj);
        }
//        Class.prototype = new superObject();
//        Class.prototype.constructor = Class;

        return Class;
    };


    window.superObject = superObject;
})($);


