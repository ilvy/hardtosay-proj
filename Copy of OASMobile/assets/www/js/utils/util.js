
var html = "";
var util = {
    /**
     * @desc:格式化date前thedaybefore天的日期
     * @param date
     * @param thedaybefore
     * @returns {string}
     */
    formatDate:function(date, thedaybefore) {
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        if (!thedaybefore) {
            m++;
            return y + "-" + ((m < 10 ? "0" : "") + m) + "-" + ((d < 10 ? "0" : "") + d);
        }
        d -= thedaybefore;
        date = new Date(y, m, d);
        d = date.getDate();
        m = date.getMonth() + 1;
        y = date.getFullYear();
        return y + "-" + ((m < 10 ? "0" : "") + m) + "-" + ((d < 10 ? "0" : "") + d);
    },
    /*
     *@desc:糅合对象
     */
    _extend:function() {
        var target = arguments[0] || {};
        var parentProps = Array.prototype.slice.call(arguments, 1);
        parentProps.forEach(function(prop) {
            if (prop) {
                for (var i in prop) {
                    if (typeof prop[i] != 'object') {
                        target[i] = prop[i];
                    } else {
                        target[i] = arguments.callee({}, prop[i]);
                    }
                }
            }
        });
        return target;
    },
    /**
     * @desc:表格排序工具
     * @param dataSource:{values1:[],values2:[]}
     * @param sortIndexs:{}
     * @param sort_thSelector
     * @param theadSelector
     * @param tbodySelector
     * @param isAutoRender
     */
    resortTablePlugin:function(dataSource,sortIndexs,sort_thSelector,theadSelector,tbodySelector,isAutoRender){
        this.dataSource = dataSource;
        this.sortIndexs = sortIndexs;
        this.theadSelector = theadSelector;
        this.tbodySelector = tbodySelector;
        this.sort_thSelector = sort_thSelector;
        if(isAutoRender){
            this.renderTable();
        }
    },
    calcDayNums:function(sDate1,sDate2){
        var aDate, oDate1, oDate2, iDays;
        aDate = sDate1.split("-")
//        oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])   //转换为12-13-2008格式
        oDate1 = new Date( aDate[0] , aDate[1] , aDate[2] )   //转换为12-13-2008格式
        aDate = sDate2.split("-")
        oDate2 = new Date(aDate[0] , aDate[1] , aDate[2])
        iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 /24);   //把相差的毫秒数转换为天数
        //alert(iDays);
        return iDays+1;
    },
    stopPropagation:function(event){
        if(event.stopPropagation){
            event.stopPropagation();
        }else if(event.cancelBubble){
            event.cancelBubble = true;
        }
    },
    getDaysBetweenTwoDate:function(date1,date2){
        date1 = new Date(date1);
        date2 = new Date(date2);
        var time1 = date1.getTime(),
            time2 = date2.getTime();
        return (time2-time1) / (24*3600*1000) + 1;
    },
    $ls:function(key,value){
        if(arguments.length == 2){
            window.localStorage.setItem("hardtosay_"+key,typeof value == 'object'?JSON.stringify(value):value);
        }else if(arguments.length == 1){
            var res = window.localStorage.getItem("hardtosay_"+key);
            return res;
        }

    },
    $ss:function(key,value){
        if(arguments.length == 2){
            window.sessionStorage.setItem("hardtosay_"+key,typeof value == 'object'?JSON.stringify(value):value);
        }else if(arguments.length == 1){
            var res = window.sessionStorage.getItem("hardtosay_"+key);
            return res;
        }
    }
}

