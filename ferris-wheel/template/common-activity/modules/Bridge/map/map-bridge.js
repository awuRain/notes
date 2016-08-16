/**
 * 地图容器内的相关js bridge
 * @author yanbin01@baidu.com zoujing@baidu.com
 */

/**
 * @class
 * @ignore
 */
var $ = require('zepto');
var Notification = require('ui/notification/index');

//支持sku的百度地图版本号
var SKU_SUPPORT_VERSION = '9.3.0';

/**
 * @class
 * @ignore
 */
var bridge = {

    /**
     * 页面路由，页面名称的配置参数
     */
    pageConfig: {
        "orderFill":{
            "map":"baidumap://map/component?comName=scenery&target=scenery_order_fillout"
        },
        "poiDetail":{
            "map":"baidumap://map/place/detail?show_type=detail_page"
        },
        'poiList':{
            'map':'baidumap://map/nearbysearch?mode=NORMAL_MODE&query=景点'
        },
        'skuDetail': {
            'map':'baidumap://map/component?comName=scenery&target=scenery_default_web_page_openapi&mode=NORMAL_MODE&popRoot=no'
        }
    },

    init: function(){
        this.urlParams = this.getRequestParams();
        this.writeLoginStatusToNative();
    },

    /**
     * 唤起地图方法类型
     */
    requestMethod: {
        //数据类请求，可回调
        'QUERY': 'QUERY',
        //分发类请求
        'DISPATCH': 'DISPATCH',
        //调用类请求
        'INVOKE': 'INVOKE'
    },

    sendMessageQueue: [],


    /**
     * 唤起地图的分享组件
     */
    share:function(obj) {
        var self = this;
        if(!self.initShareData) {
            self.initShare(obj);
        }
        self._smartShare(undefined, true);
    },

    /**
     * 打开一个地图端的页面
     * @param params
     */
    pushWindow: function(params){
        var self = this;
        if(params.page) {
            self._pageGoTo(params);
        }
        else {
            if(self.device == 'ios') {
                self._makeAnchorRequest(params['map-ios']);
            }
            else if(self.device == 'android') {
                self._makeIframeRequest(params['map-android']);
            }
        }
    },

    /**
     * 提供页面名称直接跳转，供旅游项目内部使用
     * @param params
     * @private
     */
    _pageGoTo: function(params){
        var self = this;

        if(/sku/i.test(params.page)) {
            self.getNativeInfo(function(info) {
                if(info['sv'] && self._compareVersion(info['sv'], SKU_SUPPORT_VERSION)) {
                    params.data.map = params.data.map.skuDetail;
                    _makeRequest(params);
                } else {
                    params.data.map = params.data.map.orderFill;
                    params.page = 'orderFill';
                    _makeRequest(params);
                }
            });
        } else {
            _makeRequest(params);
        }

        function _makeRequest(params) {
            var url = self._appendParam(self.pageConfig[params.page]['map'], params.data.map || {});
            if (self.pageConfig[params.page]) {
                self._makeAnchorRequest(url);
            }
            return;
        };
    },

    /**
     * 初始化分享信息
     * @param optionsArr
     * @private
     */
    initShare:function(optionsArr) {
        var self = this;
        //压缩图片
        optionsArr.imgUrl = 'http://webmap1.map.bdimg.com/maps/services/thumbnails?width=222&height=208&quality=95&align=middle,middle&src=' + optionsArr.imgUrl;
        //optionsArr.imgUrl = optionsArr.imgUrl;
        //整理参数
        var simplifiedData = {
            title: optionsArr.title,
            text: optionsArr.content,
            url: optionsArr.url,
            weiboPic: optionsArr.imgUrl,
            weixinPic: optionsArr.imgUrl
        };
        self.initShareData = true;
        self._smartShare(simplifiedData, false);
    },

    /**
     * 根据定位拿到当前省份的sid
     * @param callback
     */
    getProvinceSid: function(callback){
        var self = this;
        this.getCity(function(data){
            if(data.cityId){
                $.ajax({
                    url: self.host + "/business/ajax/dailysale/getsidbycityid?map_city_id=" + data.cityId,
                    method: "get",
                    dataType:'jsonp',
                    success: function(res){
                        if(res.errno == 0) {
                            self.sid = res.data.sid;
                            callback && callback(self.sid);
                        }
                        else {
                            callback && callback(null);
                        }
                    },
                    fail: function(){
                        callback && callback(null);
                    }
                });
            }
            else {
                callback && callback(null);
            }
        });
    },

    /**
     * 和地图NA同步登录状态
     */
    writeLoginStatusToNative: function() {
        this._requestBdApi('bdapi://wappass_login.sync');
    },

    /**
     * 打开登录界面
     * @param
     * @param {string} href 登录成功后跳转url，默认为当前url
     */
    toLogin: function(param){
        var loginUrl = "http://wappass.baidu.com/passport/login?sms=1&adapter=1",
            data = {};
        param = param || {};
        data.tpl = param.tpl || "ma";
        data.u = param.href || location.href;

        loginUrl = this.appendParam(loginUrl, data);

        //location.href = loginUrl;
        location.replace(loginUrl);
    },

    /**
     * 获取地图客户端的各类信息
     */
    getNativeInfo: function(callback){
        var self = this;
        var tmpCallback = function(dataStr) {
            var data = JSON.parse(dataStr);
            callback && callback(data);
        }

        self._requestBdApi("bdapi://getNativeInfo", tmpCallback);
    },

    /**
     *
     * @param optionsArr
     * @param initMapShare
     * @private
     */
    _mapShare: function(optionsArr, initMapShare) {

        var self = this;

        var httpReg = /http:\/\/[A-Za-z0-9\.-]{3,}\.[A-Za-z]{3}/,
            nativeUrlArr = [],
            shareBdApiUrl = initMapShare ? 'bdapi://setShareContent?' : 'bdapi://openSharePrompt?';

        optionsArr.forEach(function(e) {
            var formattedObj = {},
                title = undefined,
                content = undefined,
                contentType = undefined;
            if (e.hasOwnProperty('src')) {
                var src = e.src;
                switch (src) {
                    case "weibo":
                    case "sina_weibo":
                        formattedObj.shareTo = "sina_weibo";
                        content = e.text + e.url;
                        contentType = "text";
                        break;
                    case "weixin":
                        formattedObj.shareTo = "weixin";
                        content = e.text;
                        break;
                    case "friend":
                    case "weixin_friend":
                        formattedObj.shareTo = "weixin_friend";
                        title = e.text;
                        break;
                    default:
                        throw new Error("分享参数不对！");
                }
                formattedObj.url = e.url;
                formattedObj.title = title ? title : (e.title ? e.title : "分享百度地图");
                formattedObj.content = content;
                formattedObj.contentType = contentType ? contentType : (e.contentType ? e.contentType : "text");
                formattedObj.imageSource = (e.pic && httpReg.test(e.pic)) ? e.pic : "icon";
            }
            nativeUrlArr.push(formattedObj);
        });

        if (nativeUrlArr.length) {
            shareBdApiUrl += encodeURIComponent(JSON.stringify({
                shareList: nativeUrlArr
            }));
        }
        self._requestBdApi(shareBdApiUrl);
    },


    /**
     * 初始化微信分享、地图端分享
     * @param optionsArr: object or array
     * @example
     * //传入参数为对象
     * self._smartShare({
     *     'title': 'xxxx',
     *     'text': 'xxxx',
     *     'url': 'xxxx',
     *     'weiboPic': 'xxx',
     *     'weixinPic': 'xxx',
     * });
     *
     * //传入参数为数组
     * //其中confirm,cancal为微信中分享成功、失败的回调
     * self._smartShare([{
     *     'title': 'xxxx',
     *     'text': 'xxxx',
     *     'url': 'xxxx',
     *     'weiboPic': 'xxx',
     *     'weixinPic': 'xxx',
     *     'confirm': function(){},
     *     'cancal': function(){}
     * },{
     *     'title': 'xxxx',
     *     'text': 'xxxx',
     *     'url': 'xxxx',
     *     'weiboPic': 'xxx',
     *     'weixinPic': 'xxx',
     *     'confirm': function(){},
     *     'cancal': function(){}
     * }]);
     */
    _smartShare: function(optionsArr, inited) {
        var self = this;
        self.savedOptionsArr = self.savedOptionsArr || [];
        if (!inited) {
            if (self._objectType(optionsArr) == "Object") {
                self.savedOptionsArr = [];
                self.savedOptionsArr.push({
                    src: "weibo",
                    text: optionsArr.text,
                    url: optionsArr.url,
                    pic: optionsArr.weiboPic || optionsArr.weibopic,
                    contentType: "text"
                });
                self.savedOptionsArr.push({
                    src: "weixin",
                    title: optionsArr.title,
                    text: optionsArr.text,
                    url: optionsArr.url,
                    pic: optionsArr.weixinPic || optionsArr.weixinpic,
                    contentType: "text"
                });
                self.savedOptionsArr.push({
                    src: "friend",
                    text: optionsArr.text,
                    url: optionsArr.url,
                    pic: optionsArr.weixinPic || optionsArr.weixinpic,
                    contentType: "text"
                });
            } else {
                self.savedOptionsArr = optionsArr;
            }
            //初始化地图端右上角分享
            self._mapShare(self.savedOptionsArr, true);
        } else {
            if (self.savedOptionsArr) {
                //打开地图组件
                self._mapShare(self.savedOptionsArr, false);
            }
        }
    },


    /**
     * 调用bdapi的协议
     * @param url: 具体的schema地址
     * @param data: 携带的数据
     * @param success: 调用成功后的回调函数
     * @private
     */
    _requestBdApi: function(url, data, success) {
        var self = this;
        if (self._objectType(data) == "Function") {
            success = data;
            data = {};
        }
        url = self._appendParam(url, data);
        if (self._objectType(success) == "Function") {
            url = self._appendCallback(url, success);
        };
        self._makeIframeRequest(url, true);
    },

    requestBdApi: function(url, data, success){
        this._requestBdApi(url, data, success);
    },


    /**
     * 创建一个iframe请求,用于向NA发送schema协议
     * @param url
     * @param notime
     * @private
     */
    _makeIframeRequest: function(url, notime) {
        var self = this;
        var iframe = document.createElement('iframe');
        iframe.style.cssText = "position:absolute;top:-9999px;left:-9999px;width:0;height:0";
        iframe.id = "naaIframeRequest" + self._internalUnique();
        iframe.setAttribute('src', self._appendParam(url, notime ? "" : ("_naat=" + self._internalUnique())));
        document.body.appendChild(iframe);
        setTimeout(function() {
            document.body.removeChild(iframe);
        }, 100);
    },

    /**
     * 模拟一个a标签的点击行为，用于页面跳转
     * @param url
     * @param notime
     * @private
     */
    _makeAnchorRequest:function(url, notime) {
        var self = this;
        var a = document.createElement('a');
        a.style.cssText = "position:absolute;top:-9999px;left:-9999px;"
        a.id = "naaAnchorRequest" + self._internalUnique();
        a.setAttribute('href', self._appendParam(url, notime ? "" : ("_naat=" + self._internalUnique())));
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
        }, 100);
    },

    /**
     * 向url添加参数
     * @returns {QUnit.url|Function}
     */
    _appendParam: function(url, param){
        var self = this;
        if (self._isNull(param)) {
            return url;
        }
        if (self._objectType(param) == "Object") {
            param = self._stringifyObject(param);
        }
        if (!url) {
            url = "";
        }
        if (self._endWith(url, "?")) {
            url += param;
        } else if (self._endWith(url, "&")) {
            if (url.indexOf("?") >= 0) {
                url += param;
            } else {
                url += "?" + param;
            }
        } else {
            if (url.indexOf("?") >= 0) {
                url += "&" + param;
            } else {
                url += "?" + param;
            }
        }
        return url;
    },

    _appendCallback: function(url, fn) {
        var self = this;
        var callbackReg = /(&|\?)callback=([^&]*)?(&|$)/g;
        if ((self._objectType(fn) != "Function") || self._isBlank(url)) {
            throw new Error("callback function should be a function and url can't be blank.");
        }
        var callbackName = "naaInternalCallback" + self._internalUnique();
        window[callbackName] = function(data) {
            fn.call(window, data);
            delete window[callbackName];
        }
        var result = url;
        //callback
        if (url.search(callbackReg) >= 0) {
            result = url.replace(callbackReg, function(match, begin, value, end) {
                return begin + "callback=" + callbackName + end;
            });
        } else {
            result = self._appendParam(url, "callback=" + callbackName);
        }
        return result;
    },

    /**
     * 生成一个唯一的id
     */
    _internalUnique: (function() {
        var time = 0;
        return function() {
            return ++time;
        }
    })(),


    _trim: (function() {
        var trimReg = /(^\s*)|(\s*$)/g;
        return function(s) {
            if (!s || (typeof s !== "string")) {
                return s;
            }
            return s.replace(trimReg, '');
        }
    })(),

    _startWith: function(str, startStr) {
        if (!str || !startStr || str.length == 0 || (startStr.length > str.length))
            return false;
        if (str.substr(0, startStr.length) == startStr)
            return true;
        else
            return false;
    },

    _endWith:function(str, endStr) {
        if (!str || !endStr || str.length == 0 || (endStr.length > str.length))
            return false;
        if (str.substr(str.length - endStr.length) == endStr)
            return true;
        else
            return false;
    },

    /**
     * type check
     */
    _isBlank:function(obj) {
        return (obj === undefined || obj === null || this._trim(obj) === "");
    },

    _isNull:function(o) {
        return (!o && (o !== false) && (o !== 0));
    },

    /**
     * 获取一个object的真实类型，如function(){}就是Function、{}是Object
     */
    _objectType:(function() {
        var objectTypeReg = /^\[object (.*)\]$/;
        return function(obj) {
            if (typeof obj == "object" || typeof obj == "function") {
                return Object.prototype.toString.call(obj).match(objectTypeReg)[1];
            } else {
                return undefined;
            }
        }
    })(),

    /**
     * convert Object to "a=1&b=2" liked String
     * @param obj
     * @returns "a=1&b=2" liked
     */
    _stringifyObject:function(obj) {
        var self = this;
        if (self._objectType(obj) !== "Object") {
            if (self._isBlank(obj) || (typeof obj !== "string")) {
                return "";
            }
            return obj;
        }
        var r = "";
        self._hasOwn(obj, function(key, value) {
            r += "&" + key + "=" + encodeURIComponent(value);
        });
        return r.substr(1);
    },

    /**
     *遍历对象的所有自有属性，执行回调函数fn(key,value)
     */
    _hasOwn: function(obj, fn) {
        var k, v;
        for (k in obj) {
            if (obj.hasOwnProperty(k)) {
                v = obj[k];
                fn && (fn.call(window, k, v));
            }
        }
    },

    /**
     * 比较两个版本号的大小，
     * @return {Boolean}   若v1版本较大（或相等），则返回true，否则返回false
     */
    _compareVersion: function(v1, v2) {
        var v1 = v1.split('.'),
            v2 = v2.split('.'),
            len = Math.max(v1.length, v2.length),
            i = 0;
        for (; i < len; i++) {
            if ((v1[i] && !v2[i] && parseInt(v1[i]) > 0) || (parseInt(v1[i]) > parseInt(v2[i]))) {
                return true;
            } else if ((v2[i] && !v1[i] && parseInt(v2[i]) > 0) || (parseInt(v1[i]) < parseInt(v2[i]))) {
                return false;
            }
        };
        return true;
    },

    /**
     *  string 操作增强trim , startWith, endWith
     */
    _trim: (function() {
        var trimReg = /(^\s*)|(\s*$)/g;
        return function(s) {
            if (!s || (typeof s !== "string")) {
                return s;
            }
            return s.replace(trimReg, '');
        }
    })()

};

module.exports = bridge;


