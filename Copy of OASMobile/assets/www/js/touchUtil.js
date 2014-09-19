/**
 * Created by Administrator on 14-8-27.
 */

var touchEvent = {

    touchstart:"touchstart",
    touchmove:"touchmove",
    touchend:"touchend",
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