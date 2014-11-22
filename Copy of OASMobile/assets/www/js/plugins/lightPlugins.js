/**
 * Created by Administrator on 14-11-15.
 */
$.fn.drag = function(imgSrc,cb){
    var $selector = $this = $(this);
    var selector = $this.selector;
    var image = new Image();
    image.src = remoteServer+"/"+imgSrc;
    var fixPos = {};
    var isDragging = false,
        mousePos = {},
        objectPos = {};
    $(image).load(function(){
        var naturalW = image.width,//$(selector+" img")[0].naturalWidth,
            naturalH = image.height;//$(selector+" img")[0].naturalHeight;
//        function setSrc(){
//        navigator.notification.alert("set img:H-"+naturalH+"W:"+naturalW,function(){});
        if(naturalH >= naturalW){//top 按比例即可
            fixPos.type = 2;
            $(selector+" img").attr("src",remoteServer+"/"+imgSrc).attr("width",$(".photo-frame").width());
        }else{
            fixPos.type = 1;
            $(selector+" img").attr("src",remoteServer+"/"+imgSrc).attr("width",200);
        }
    });

//        };
    $(document).on(touchEvent.touchstart,function(event){
        isDragging = true;
        if(event.originalEvent && event.originalEvent.targetTouches){
            event = event.originalEvent.targetTouches[0];
        }
        console.log("clientX:"+event.clientX);
        mousePos.x = event.clientX;
        mousePos.y = event.clientY;
        objectPos.x = $selector.position().left;
        objectPos.y = $selector.position().top;
    });
    $(document).bind(touchEvent.touchmove,function(event){
        event.preventDefault();
//            var $selector = $(selector);
        if(event.originalEvent && event.originalEvent.targetTouches){
            event = event.originalEvent.targetTouches[0];
        }
        if(isDragging){
            var x_offset = event.clientX - mousePos.x,
                y_offset = event.clientY - mousePos.y;
            objectPos.x += x_offset;
            objectPos.y += y_offset;
            $selector.css({
                top:objectPos.y,
                left:objectPos.x
            });
            mousePos.x = event.clientX;
            mousePos.y = event.clientY;
        }

    });
    $(document).on(touchEvent.touchend,function(){
        isDragging = false;
    });
    /**
     * #fixImg：确认按钮
     */
    $("#fixImg").off("click")
        .on("click",function(){
        var framePos = $(".photo-frame").offset();
        var imgPos = $(".photo-carrier").offset();
        navigator.notification.alert("set img:framePos-"+framePos.left+"imgPos:"+imgPos.left,function(){});
        fixPos.baseSize = 50;
        var ratio = Number($(".photo-frame").width()) / 50;
        fixPos.left = (framePos.left - imgPos.left) / ratio,
            fixPos.top = (framePos.top - imgPos.top) / ratio;
//        fixPos.user_id = util.$ls("host");
        fixPos.path = imgSrc;
        global.headerImgPos = fixPos;
        $("#updateImgPos").css("display","none");
    });
}