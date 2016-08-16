
var utils = {

    //初始化，做环境嗅探，系统判断，私有函数，不继承
    _init: function(){
        this.device = this.isIos()?'ios': (this.isAndroid()?'android':'other');
        if(this.isBaiduMap()) {
            this.client = 'map';
        }
        else if(this.isNuomi()) {
            this.client = 'nuomi';
        }
        else if(this.isBaiduTravel()) {
            this.client = 'lvyou';
        }
        else if(this.isWechat()) {
            this.client = 'wechat';
        }
        else {
            this.client = 'webapp';
        }
    },
    //判断是百度旅游客户端
    isBaiduTravel: function(){
        return /baidutravel/i.test(navigator.userAgent);
    },
    //判断是百度地图客户端
    isBaiduMap: function(){
        return /baidumap/i.test(navigator.userAgent);
    },
    //判断是否是糯米客户端
    isNuomi: function(){
        return /Nuomi/i.test(navigator.userAgent);
    },
    //判断是否是微信客户端
    isWechat: function() {
        return /micromessenger/i.test(navigator.userAgent)
    },
    //判断是否是ios系统
    isIos: function(){
        return !!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    },
    //判断是否是安卓系统
    isAndroid: function(){
        return window.navigator.userAgent.indexOf('Android') > -1 || window.navigator.userAgent.indexOf('Adr') > -1;
    },
    //判断是否字符串
    isString: function(it) {
        var ostring = Object.prototype.toString;
        return ostring.call(it) === '[object String]';
    },
    //返回随机值
    getRandomKey: (function() {
        var n = 0;
        return function() {
            return '_$@r' + (n++);
        }
    })(),
    /**
     * 向url添加参数
     * @returns {QUnit.url|Function}
     */
    appendParam: function(url, param){
        var self = this;
        if (self.isNull(param)) {
            return url;
        }
        if (self.objectType(param) == "Object") {
            param = self.stringifyObject(param);
        }
        if (!url) {
            url = "";
        }
        if (self.endWith(url, "?")) {
            url += param;
        } else if (self.endWith(url, "&")) {
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
    /**
     * 获取一个object的真实类型，如function(){}就是Function、{}是Object
     */
    objectType: (function() {
        var objectTypeReg = /^\[object (.*)\]$/;
        return function(obj) {
            if (typeof obj == "object" || typeof obj == "function") {
                return Object.prototype.toString.call(obj).match(objectTypeReg)[1];
            } else {
                return undefined;
            }
        }
    })(),

    endWith:function(str, endStr) {
        if (!str || !endStr || str.length == 0 || (endStr.length > str.length))
            return false;
        if (str.substr(str.length - endStr.length) == endStr)
            return true;
        else
            return false;
    },

    stringifyObject:function(obj) {
        var self = this;
        if (self.objectType(obj) !== "Object") {
            if (self.isBlank(obj) || (typeof obj !== "string")) {
                return "";
            }
            return obj;
        }
        var r = "";
        self.hasOwn(obj, function(key, value) {
            r += "&" + key + "=" + encodeURIComponent(value);
        });
        return r.substr(1);
    },

    /**
     *遍历对象的所有自有属性，执行回调函数fn(key,value)
     */
    hasOwn: function(obj, fn) {
        var k, v;
        for (k in obj) {
            if (obj.hasOwnProperty(k)) {
                v = obj[k];
                fn && (fn.call(window, k, v));
            }
        }
    },

    isNull:function(o) {
        return (!o && (o !== false) && (o !== 0));
    },

    getRequestParams: function(uri){
        var search = location.search.substring(1),
            res = {};
        search = uri || search;
        (search.split('&') || []).forEach(function(item,index){
            var _item = item || '',
                _itemSplit = _item.split('=') || [],
                _key = _itemSplit[0],
                _val = _itemSplit[1];
            res[_key] = _val;
        });
        return res;
        // return search ? JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function(key, value) {
        //     return key === "" ? value : decodeURIComponent(value);
        // }) : {};
    }
};

utils._init();

module.exports = utils;

