/**
 * Created by Administrator on 14-8-27.
 */

var touchEvent = {

    touchstart:"touchstart",
    touchmove:"touchmove",
    touchend:"touchend",
    longtouch:"longtouch",//touchstart 超过0.5s
    click:"click",//touchstart -> touchend
    /**
     * 判断是否触摸设备，若非触摸设备，touch事件替换为鼠标事件
     */
    init:function(){
        if (isPC()) {
            this.touchstart = "mousedown";
            this.touchmove = "mousemove";
            this.touchend = "mouseup";
        }
        return this;
    }
}

/**
 * 判断是否pc设备
 * @returns {boolean}
 */
function isPC(){
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("android", "iphone", "symbianos", "windows phone", "ipad", "ipod");
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.toLowerCase().indexOf(Agents[v]) > 0) { flag = false; break; }
    }
    return flag;
}

touchEvent.init();

/**
 * 封装触摸事件
 * @param type
 * @param cb
 */
var longTouchtimeout;
var touchStartTime,touchEndTime;
$.fn.touch = function(type,selector,cb){
//    if(isPC()){
//        $(this).each(function(){
//            $(this).on(type,cb);
//        });
//        return;
//    }
    if(arguments.length == 2){
        cb = selector;
    }
    //移动设备触摸事件
    $(this).each(function(){
        $(this).off(touchEvent.touchstart);
        $(this).on(touchEvent.touchstart,function(event){
            touchStartTime = new Date().getTime();
            var _$this = $(this);
            //长按0.5s后进入longTouch事件
            longTouchtimeout = setTimeout(function(){
                event.$this = _$this;
                cb(event);
            },500);
        });
    });

    switch (type){
        case touchEvent.longtouch:
            $(this).each(function(){
                $(this).on(touchEvent.touchend,function(event){
                    touchEndTime = new Date().getTime();
                    if((touchEndTime - touchStartTime) < 500){//若非长按，移除长按的定时器，消除事件触发
                        clearTimeout(longTouchtimeout);
                    }
                })
            });
            break;
        case touchEvent.click:
            $(this).each(function(){
                $(this).on(touchEvent.touchend,function(event){
                    touchEndTime = new Date().getTime();
                    var _$this = $(this);
                    if((touchEndTime - touchStartTime) < 500){
                        clearTimeout(longTouchtimeout);
                        event.$this = _$this;
                        cb(event);
                    }
                });
            });
            break;
    }

}