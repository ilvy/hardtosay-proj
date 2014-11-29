/**
 * Created by Administrator on 14-10-10.
 */
define("modules/relative/relative",['util','superObject','draw','touchUtil','globalManager',
    'messageManager','socketManager','lightPlugins','callpGPlugins'],function(){

    var relative = superObject.extend({
        data:{},
        humansData:{},
        initialize:function(html,data){
            if(!util.$ls("login")){
                changeHash("#login");
                return;
            }
            global.currentPage = 'relative';
            $("#content").html(html);
//            this.humansData = relativeManager.getAll();//JSON.parse(util.$ls("humansData"));
            this.dealHumansData();
            var _this = this;
            $(function(){
                _this.drawSvgLines();
            });
            this.addBindListener();
            this.renderHeadImg();
        },
        renderHeadImg:function(){
            var name = util.$ls("host");
            var headImgObj = dataManager.getAsJSON(name,"headImg");
            if(!headImgObj || headImgObj == null || headImgObj == 'null' || !headImgObj.path){
                return;
            }else{
                //            $(function(){
                var ratio = $(".me").outerWidth() / headImgObj.baseSize;
                var bgSize = "";
                if(headImgObj.type == 2){
                    bgSize = headImgObj.baseSize * ratio;
                }else if(headImgObj.type == 1){
                    bgSize = headImgObj.baseSize * 2 * ratio;
                }
                $(".me").css({
                    backgroundImage:'url('+remoteServer+'/'+headImgObj.path+')',
                    backgroundSize:bgSize,
                    'background-position-y':-headImgObj.top * ratio+"px",
                    'background-position-x':-headImgObj.left * ratio+"px",
                    backgroundRepeat:'no-repeat'
                });
//            });
            }
        },
        addBindListener:function(){//bindListener 需要重复监听
            var _this = this;
            $(".relation-node").touch(touchEvent.click,function(event){
                if(event.$this.hasClass('me')){
                    navigator.notification.confirm("更换头像",function(index){
                        if(index == 1){
                            picturePlugins.getPicture(function(){
                                console.log(global.headerImgPos);
                                console.log(global.headerImgPos.path);
                                var url = remoteServer + '/updateImgPosition';
                                $.ajax({
                                    url:url,
                                    type:"post",
                                    data:global.headerImgPos,
                                    success:function(results){
                                        var msg = "上传成功";
                                        if(results.flag != 1){
                                            msg = "上传失败";
                                        }else{
                                            var newImagePos = results.results;
                                            var name = util.$ls("host");
                                            var headImgObj = dataManager.addAsJSON(name,"headImg",newImagePos);
                                            _this.renderHeadImg();
                                        }
                                        navigator.notification.alert(msg,function(){},"更换头像",["确定"]);
                                    },
                                    error:function(err){
                                        console.log(err);
                                    }
                                });
                            });
                        }
                    },"个人信息",["确定","取消"]);
                    return;
                }
                var category = event.$this.data("cate_en");
                $("."+category).removeClass("remind-tag");//移除右上角的提示红点
//                var humansData = relativeManager.getAll();
//                var data = humansData[category];
                currentCate = category;
//                util.$ls("humanspage",data);
                changeHash("#humans");
            });
            $(".relation-node").touch(touchEvent.longtouch,function(event){
                if(event.$this.hasClass('me')){
                    return;
                }
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
                        $("body > .spare-input").remove();
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