/**
 * Created by Administrator on 14-8-22.
 */
$(function(){
    drawSvgLines();
    addListener();
});

/**
 * 画svg
 * @param startX
 * @param startY
 * @param boxWidth
 * @param boxHeight
 * @returns {*}
 */
function drawSvg(startX,startY,boxWidth,boxHeight){
    var styleObj = {
        "viewBox": startX+" "+startY+" " + boxWidth + " " + boxHeight,
        width:boxWidth,
        height:boxHeight
    }
    return svgBrush.drawing("svg",styleObj,document.getElementById("test"));
}

/**
 * 画svg中的线条
 */
function drawSvgLines(){
    var svg = drawSvg(0,0,$(window).width(),$(window).height());
    var posOfme = getPos(".me");
    var posOfParents = getPos(".parents");
    var posOfpartner = getPos(".partner");
    var posOfchildren = getPos(".children");
    var posOflace = getPos(".lace");
    var posOfsoap = getPos(".soap");
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
}

/**
 *
 * @param selector
 * @returns {{}}
 */
function getPos(selector){
    var pos = {};
    pos.x = $(selector).position().left+$(selector).width() / 2;
    pos.y = $(selector).position().top+$(selector).height() / 2;
    return pos;
}

function addListener(){
//    $(".content").on(touchEvent.touchstart,'.partner',function(event){
//        $(this).path({
//            radius: 100, //半径
//            radian: 90, //弧度
//            duration: 200//动画时间
//        });
//    })
    $(".back-btn").bind("click",function(){
        switch (currentPage){
            case 'relative':

                break;
            case 'humans':
                break;
            case 'message':
                break;
            case 'addRelation':
                break;
        }
    });
}