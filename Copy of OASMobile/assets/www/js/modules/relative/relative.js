/**
 * Created by Administrator on 14-10-10.
 */
define("modules/relative/relative",['util','superObject','draw','touchUtil','messageManager'],function(){

    var relative = superObject.extend({
        data:{},
        humansData:{},
        initialize:function(html,data){
            currentPage = 'relative';
            $("#content").html(html);
            this.data = JSON.parse(util.$ls("humansData"));
            this.dealHumansData();
            var _this = this;
            $(function(){
                _this.drawSvgLines();
            });
            this.addListener();
        },
        addListener:function(){
//            $(".main-btn").wheelmenu({
//                trigger: "click",
//                animation: "fly",
//                animationSpeed: "fast"
//            });
//            $(document).on("click",'.relation-node',function(event){
//                changeHash("#message");
//            });
            var _this = this;
            $(".relation-node").touch(touchEvent.click,function(event){
                var category = event.$this.data("cate_en");
                var data = _this.humansData[category];
                util.$ls("humanspage",data);
                changeHash("#humans",data);
            });
            $(".relation-node").touch(touchEvent.longtouch,function(event){
                changeHash("#addRelation",{category:event.$this.data("cate_en")});
            });
            /**
             * 回退按钮
             */
            $(".back-btn").on("click",function(){
                var currPage = $(this).data("page");
                switch (currPage){
                    case "relative":
                        break;
                    case "humans":
                        changeHash("#relative");
                        break;
                    case "message":
                        changeHash("#humans");
                        break;
                    case "addRelation":
                        break;
                }
            });
        },
        dealHumansData:function(){
            var data = this.data;
            this.humansData = {};
            for(var i = 0; i < data.length; i++){
                var relative = data[i]["relative"];
                if(data[i].status == 0 && data[i].relativeFlag == -1){
                    this.showAddRelationRequest(relative,data[i]);
                }
                if(!this.humansData[relative]){
                    this.humansData[relative] = [];
                }
                this.humansData[relative].push(data[i]);
            }
        },
        /**
         * TODO 显示有加关系请求的提示
         */
        showAddRelationRequest:function(relative){
//            $()
            console.log(relative+"有好友请求消息");
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
    return function(html,data){
        new relative(html,data);
    }
});