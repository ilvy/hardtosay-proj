
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
    }
}

$.extend(util.resortTablePlugin.prototype,{

    renderTable:function(){
        var theadStr = '<tr>';
        var sortClass='';
        var tdNum = 0;
        for(var i in this.dataSource){
            if(!tdNum){
                tdNum = this.dataSource[i].length;
            }
            sortClass='sorting';
            theadStr += '<th class="'+sortClass+' sort_th" id="th_'+i+'" role="columnheader" aria-controls="datatable_col_reorder" aria-sort="ascending">'+i+'</th>';
        }
        theadStr += '</tr>';
        $(this.theadSelector).html(theadStr);
        this.addSortingListener();
        var tbodyStr = '';
        for(i = 0; i < tdNum; i++){
            var p = i % 2 ? "odd":"even";
            var trStr = '<tr id="tr'+i+'" class="'+p+'">';
            for(var j in this.dataSource){
                var width = $("#th_"+j).width();
                trStr += '<td style="width: '+width+'px">'+this.dataSource[j][i]+'</td>';
            }
            trStr += '</tr>';
            tbodyStr += trStr;
        }
        $(this.tbodySelector).html(tbodyStr);
    },
    addSortingListener:function(){
        var that = this;
        $(function(){
            $(that.theadSelector+" "+that.sort_thSelector).bind("click",function(){
                var $this = $(this);
                var sortType = '';
                var zbName = $this.attr("id");
                zbName = zbName.substring(
                zbName.indexOf("th_")+3);
                $this.removeClass("sorting");
                if($this.hasClass("sorting_asc")){
                    $this.removeClass("sorting_asc").addClass("sorting_desc");
                    sortType = 'desc';
                }else{
                    $this.removeClass("sorting_desc").addClass("sorting_asc");
                    sortType = 'asc';
                }
                that.reSortTable(zbName,sortType);
            })
        })
    },
    /**
     * @desc:根据指标名重新排序，
     * @param zbName：同比，环比
     */
    reSortTable:function(zbName,sortType){
        var sortDatas = this.dataSource[zbName];
        var len = sortDatas.length;
        var sortIndexs = this.sortIndexs[zbName];

        if(!this.sortIndexs[zbName]){
            var copySortDatas = sortDatas.slice();
//            for(var i = 0; i < len; i++){        //拷贝一份数据进行排序
//                copySortDatas[i] = sortDatas[i];
//            }
            this.sortIndexs[zbName] = [];
            sortIndexs = this.sortIndexs[zbName];
            for(var i = 0; i < len; i++){
                sortIndexs[i] = i;
            }
            this.quickSort(sortIndexs,copySortDatas,0,len - 1);
        }

        this.reRenderTable(sortIndexs,sortType);
    },
    reRenderTable:function(sortIndexs,sortType){
        var len = sortIndexs.length;
        var tbodyHtml = '';
        if(sortType == 'asc'){
            for(var i = 0; i < len; i++){
                tbodyHtml += $("#tr"+sortIndexs[i])[0].outerHTML;
            }
        }else{
            for(var i = len - 1; i >= 0; i--){
                tbodyHtml += $("#tr"+sortIndexs[i])[0].outerHTML;
            }
        }

        $(this.tbodySelector).html(tbodyHtml);
    },
    /**
     * @desc:快速排序
     * @param sortIndexs:对原始数组的下标排序
     * @param array:待排序数组
     * @param l
     * @param r
     */
    quickSort:function(sortIndexs,array,l,r){
        if(l >= r){
            return;
        }
        var x = array[l];
        var si = sortIndexs[l];
        var i = l,j = r;
        while(i < j){
            while(i < j&& this.formatNumber(array[j]) >= this.formatNumber(x)){
                j--;
            }
            if(i < j){
                array[i] = array[j];
                sortIndexs[i] = sortIndexs[j];
                i++;
            }

            while(i < j&&this.formatNumber(array[i]) <= this.formatNumber(x)){
                i++;
            }
            if(i < j){
                array[j] = array[i];
                sortIndexs[j] = sortIndexs[i];
                j--;
            }

        }
        array[i] = x;
        sortIndexs[i] = si;
        this.quickSort(sortIndexs,array,l,i-1);
        this.quickSort(sortIndexs,array,i+1,r);
    },

    /**
     * @desc:格式化高位带‘,’的数字
     * @param bigNum
     * @returns {*}
     */
    formatNumber:function(bigNum){
        if(bigNum.split('-').length != 1){
            return bigNum;
        }
        var numParts = bigNum.split(",");
        var resNum = '';
        var len = numParts.length;
        for(var i = 0; i < len; i++){
            resNum += numParts[i];
        }
        return Number(resNum);
    }
})
