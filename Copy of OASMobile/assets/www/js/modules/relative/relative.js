/**
 * Created by Administrator on 14-10-10.
 */
define("modules/relative/relative",['util','superObject','draw'],function(){

    var relative = superObject.extend({
        initialize:function(html){
            $("#content").html(html);
            var _this = this;
            $(function(){
                _this.drawSvgLines();
            });
            this.addListener();

        },
        addListener:function(){
            $(".main-btn").wheelmenu({
                trigger: "click",
                animation: "fly",
                animationSpeed: "fast"
            });
            $(document).on("click",'.relation-node',function(event){
                changeHash("#message");
            });
        },
        /**
         * 画svg
         * @param startX
         * @param startY
         * @param boxWidth
         * @param boxHeight
         * @returns {*}
         */
        drawSvg:function(startX,startY,boxWidth,boxHeight){
            var styleObj = {
                "viewBox": startX+" "+startY+" " + boxWidth + " " + boxHeight,
                width:boxWidth,
                height:boxHeight
            }
            return svgBrush.drawing("svg",styleObj,document.getElementById("test"));
        },

        /**
         * 画svg中的线条
         */
        drawSvgLines:function(){
            var svg = this.drawSvg(0,0,$(window).width(),$(window).height());
            var posOfme = this.getPos(".me");
            var posOfParents = this.getPos(".parents");
            var posOfpartner = this.getPos(".partner");
            var posOfchildren = this.getPos(".children");
            var posOflace = this.getPos(".lace");
            var posOfsoap = this.getPos(".soap");
            var styleObj = {
                fill:"none",
                stroke:"green",
                "stroke-width":3
            };
            svgBrush.drawing("polyline",styleObj,svg,[posOfme,posOfParents]);
            svgBrush.drawing("polyline",styleObj,svg,[posOfme,posOfpartner]);
            svgBrush.drawing("polyline",styleObj,svg,[posOfpartner,posOflace]);
            svgBrush.drawing("polyline",styleObj,svg,[posOflace,posOfsoap]);
            svgBrush.drawing("polyline",styleObj,svg,[posOfme,posOfchildren]);
        },

        /**
         *
         * @param selector
         * @returns {{}}
         */
        getPos:function(selector){
            var pos = {};
            pos.x = $(selector).position().left+$(selector).width() / 2;
            pos.y = $(selector).position().top+$(selector).height() / 2;
            return pos;
        }
    });
    return function(html){
        new relative(html);
    }
});