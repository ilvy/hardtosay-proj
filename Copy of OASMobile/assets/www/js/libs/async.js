var async = {},fileConfigs = {};


/*
 * LOAD SCRIPTS
 * Usage:
 * Define function = myPrettyCode ()...
 * loadScript("js/my_lovely_script.js", myPrettyCode);
 */

var jsArray = {};

/*
 *加载所有js文件，scriptNames：js文件名数组
 *有依赖关系的js文件需要按顺序
*/
function loadScripts(scriptNames, cb, i) {
    if (!i && i != 0) {
        i = 0;
    }
    if (i == scriptNames.length) {
        typeof cb == "function" ? cb() : cb = null;
        return;
    }
    loadScript(scriptNames[i], function () {
        if (i == scriptNames.length - 1) {
            typeof cb == "function" ? cb() : cb = null;
            console.log(scriptNames[i]);
        }
        i++;
        loadScripts(scriptNames, cb, i);
    });
}

/*
 *加载单个script文件   //注意点：scriptName必须与模块url路径一致
*/
function loadScript(scriptName, callback) {
    if(scriptName == ""){
        return;
    }
    //处理需要加载的js脚本名，若已经配置，则读取配置路径，否则，原路径
    scriptName = fileConfigs[scriptName]?fileConfigs[scriptName]:scriptName;
    if (!jsArray[scriptName] && scriptName != "") {
        jsArray[scriptName] = true;

        // adding the script tag to the head as suggested before
        var body = document.getElementsByTagName('body')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = scriptName + (scriptName.indexOf('.js') == -1 ? ".js" : "");

        // then bind the event to the callback function
        // there are several events for cross browser compatibility
        //script.onreadystatechange = callback;
        script.onload = callback;

        // fire the loading
        body.appendChild(script);

    } else if (callback) {// changed else to else if(callback)
        //console.log("JS file already added!");
        //execute function
        callback();
        var url = convertHashToURL();
//        var modUrl = toModUrl(url);
        checkURL(url);
//        if (scriptName.indexOf(modUrl)!=-1) {
//            //callbacks[url](templates[url]);
//            checkURL(url);
//        }
        
    }

}

/* ~ END: LOAD SCRIPTS */

/*模块根路径*/
var root = "./js/";

/*
 *  Each hash corresponding to template,
 *  each template will be recorded and just load once
 */
var templates = {};
// DO on hash change
$(window).on('hashchange', function (event) {
    url = location.hash.replace(/^#/, '');
    if (url == '' || url.length == 0) {
        return;
    }
    url = convertHashToURL();
//    url = toModUrl(url);
    loadCB(url);
});

/*debug 刷新页面时候刷新当前hash内容*/
loadCB(convertHashToURL());

/**
 * @desc:解析url,to solve the problem that two different paths corresponding to one module
 * @param url
 * @returns {*}
 */
function toModUrl(url){
    return moduleConfig[url]?moduleConfig[url]:url;
}

function parseModUrl(url){
    return url.split("#")[0];
}

/*
 *加载define定义的模块回调
*/
function loadCB(url) {
    var jsRoute = "";
    var mn = "";
    mn = url;
    if (url) {
        loadScript(root+url, function () {
            //callbacks[mn](data);
        });
    } else {
        // grab the first URL from nav
        //$this =  $('nav > ul > li:first-child > a[href!="#"]');

        //update hash
        window.location.hash = $.defaultHash; //$this.attr('href') || "#modules/zbTrend/zbTrend";
//        $("nav ul a[href *='#modules']:first-child").click();
    }
}

var flag = 0;
// CHECK TO SEE IF URL EXISTS
function checkURL(url) {
    var href = '';
    //get the url by removing the hash
    // Do this if url exists (for page refresh, etc...)
    if (url) {
        href = url;
//        url = toModUrl(url);
        loadURL(url);
    } else {

        // grab the first URL from nav
        //$this = $('nav > ul > li:first-child > a[href!="#"]');
        //update hash
        window.location.hash = $.defaultHash;//$this.attr('href');
//        $("nav ul a[href *='#modules']:first-child").click();
    }

}

// LOAD AJAX PAGES

function loadURL(url) {
    //console.log(container)
    var jsRoute = "";
    var mn = "";
    mn = url.split(".")[0];
    jsRoute = root + mn + ".js";
    if (!templates[url]) {
        $.ajax({
            type: "GET",
            url: root + url + ".html",
            dataType: 'html',
            cache: true, // (warning: this will cause a timestamp and will call the request twice)
            beforeSend: function () {
                // cog placed
//                drawBreadCrumb();
            },
            success: function (data) {

                templates[url] = data;
                console.log(url + "模板加载成功");
                //模板加载成功后加载js,加载完js后执行该js
                if (typeof callbacks[mn] == "function")
                    callbacks[mn](data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //container.html('<h4 style="margin-top:10px; display:block; text-align:left"><i class="fa fa-warning txt-color-orangeDark"></i> Error 404! Page not found.</h4>');
            },
            async: false
        });
    } else {
//        drawBreadCrumb();
        if (typeof callbacks[mn] == "function")
            callbacks[mn](templates[url]);
    }
    //直接处理模块对应的回调

    //console.log("ajax request sent");
}

//对应于模块的回调
var callbacks = {};

/**
 *每一个模块定义
 */
function define(moduleName, jsDependences, callback) {
    //先加载依赖文件，再处理模块定义的回调
    loadScripts(jsDependences, function () {
        if (!callbacks[moduleName]) {
            if (typeof callback == "function") {
                callbacks[moduleName] = callback();
            } else {
                callbacks[moduleName] = callback;
            }
            var url = convertHashToURL();
            checkURL(url);
        }
    });
}

/*
 *手动变更hash值
*/
function changeHash(hash) {
    window.location.hash = hash;
}

function convertHashToURL(){
    var url = location.hash.replace(/^#/, '');
    var moduleName = url;
    url = 'modules/'+moduleName+"/"+url;
    return url;
}

function changeHashToUrl(hash) {
    return hash.replace(/^#/, '');
}
