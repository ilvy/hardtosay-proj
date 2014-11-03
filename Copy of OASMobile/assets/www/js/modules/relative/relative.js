/**
 * Created by Administrator on 14-10-10.
 */
define("modules/relative/relative",['util','superObject','draw','touchUtil','globalManager','messageManager','socketManager'],function(){

    var relative = superObject.extend({
        data:{},
        humansData:{},
        initialize:function(html,data){
            global.currentPage = 'relative';
            $("#content").html(html);
//            this.humansData = relativeManager.getAll();//JSON.parse(util.$ls("humansData"));
            this.dealHumansData();
            var _this = this;
            $(function(){
                _this.drawSvgLines();
            });
            this.addBindListener();
        },
        addBindListener:function(){//bindListener 需要重复监听
            var _this = this;
            $(".relation-node").touch(touchEvent.click,function(event){
                var category = event.$this.data("cate_en");
                $("."+category).removeClass("remind-tag");//移除右上角的提示红点
                var humansData = relativeManager.getAll();
                var data = humansData[category];
                currentCate = category;
                util.$ls("humanspage",data);
                changeHash("#humans",data);
            });
            $(".relation-node").touch(touchEvent.longtouch,function(event){
                currentCate = event.$this.data("cate_en");
                changeHash("#addRelation",{category:event.$this.data("cate_en")});
            });
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
            /**
             * 回退按钮
             */
            $(".back-btn").bind("click",function(){
                var currPage = global.currentPage;
                switch (currPage){
                    case "relative":
                        var user = util.$ls("host");
                        socket.sendMessage(protocolConfig.logout,{user:user});
                        window.location.href = 'index.html';
                        changeHash("login");
                        break;
                    case "humans":
                        changeHash("#relative");
                        break;
                    case "message":
                        changeHash("#humans");
                        break;
                    case "addRelation":
                        changeHash("relative");
                        break;
                }
            });
        },
        /**
         * 处理用户加关系请求
         */
        dealHumansData:function(){
            var data = relativeManager.getAll();
            for(var key in data){
                for(var i = 0; i < data[key].length; i++){
                    var record = data[key][i];
                    if(record.status == 0 && record.relativeFlag == -1){
                        this.showAddRelationRequest(key,data[key][i]);
                    }
                }
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
        if(!global.modules["relative"]){
            global.modules["relative"] = new relative(html,data);
            global.modules["relative"].addListener();
        }else{
            global.modules["relative"].initialize(html);
            global.modules["relative"].addListener();
        }

    }
});