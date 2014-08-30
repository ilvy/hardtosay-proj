/**
 * Created by Administrator on 14-8-23.
 */


function SvgBrush(){
    this.svgns  = 'http://www.w3.org/2000/svg';
    this.doc = null;
    this.init = function(){
        if(window.svgDocument){
            this.doc = window.svgDocument;
        }else{
            this.doc = document;
        }
    }

}

/**
 * 画折线
 * @param points：折线的点
 * @param styleObj:样式对象
 */
SvgBrush.prototype.drawing = function(type,styleObj,parentEle,points){
    var shape = this.doc.createElementNS(this.svgns,type);
    var pointsStr = "";
    if(arguments.length == 4){
        points.forEach(function(item,i){
            pointsStr += item.x+","+item.y+" ";
        });
        shape.setAttributeNS(null,"points",pointsStr);
    }
    for(var o in styleObj){
        shape.setAttributeNS(null,o,styleObj[o]);
    }
    parentEle.appendChild(shape);
    return shape;
}


var svgBrush = new SvgBrush();
svgBrush.init();