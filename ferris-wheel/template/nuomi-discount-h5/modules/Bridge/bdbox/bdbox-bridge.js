/**
 * 手机百度客户端内的相关js bridge
 * @author yanbin01@baidu.com zoujing@baidu.com
 */
var $ = require('zepto');
var bridge =  {

	/**
     * 获取版本号
     * @return {String} version 返回手机百度的版本号
     */
	getVersion: function() {
		var back = 0;
	    if (window.baiduboxapp_version) {
	        back = window.baiduboxapp_version;
	    } else {
	        var str = navigator.userAgent;
	        var a;

	        if (a = /([\d+.]+)_(?:diordna|enohpi)_/.exec(str)) {
	            a = a[1].split('.');
	            back = a.reverse().join('.');
	        } else if (a = /baiduboxapp\/([\d+.]+)/.exec(str)) {
	            back = a[1];
	        }
	    }
	    return back;
	},

	/**
     * 版本号对比
      * @param  {String} version1 第一个版本号
 	  * @param  {String} version2 第二个版本号
 	  * @return {Nubmer} num  version1==version2返回0；version1>version2返回1；小于返回-1
     */
	version_compare: function(version1, version2) {
		version2 += '';
	    version1 += '';

	    var a = version1.split('.'),
	        b = version2.split('.'),
	        i = 0,
	        len = Math.max(a.length, b.length);

	    for (; i < len; i++) {
	        if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
	            return 1;
	        } else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
	            return -1;
	        }
	    }
	    return 0;
	},

	iosInvoke: function(action, params, callback) {
		if (!action) {
	        return;
	    }

	    var url = [];
	    if ($.isFunction(params)) {
	        callback = params;
	    } else {
	        for (var i in params) {
	            url.push(i + '=' + params[i]);
	        }
	    }
	    if ($.isFunction(callback)) {
	        var funcName = '_bdbox_js_' + $.getId();
	        window[funcName] = function() {
	            callback.apply(window, ([]).slice.call(arguments, 0));
	            /*delete window[funcName];*/
	        };
	        url.push('func=' + funcName);
	    } else {
	        if (callback) {
	            url.push('func=' + callback);
	        }
	    }
	    url = 'baiduboxapp://' + action + '?' + url.join('&');
	    var id = '_bdbox_ios_jsbridge';
	    var $node = document.getElementById(id);
	    if ($node) {
	        $node.src = url;
	    } else {
	        $node = document.createElement('iframe');
	        $node.style.display = 'none';
	        $node.id = id;
	        $node.src = url;
	        (document.body || document.getElementsByTagName('body')[0]).appendChild($node);
	    }

	},

	androidInvoker: function(name, func, args) {},

    /**
     * 调用分享组件
     * @param params: 参数对象，包括分享标题、内容、图片、链接等信息
     */
    share: function(params){
    	var self = this;
        alert(self.getVersion());
        var version = self.getVersion();
        alert(self.version_compare(version, '5.3.5'));
    }

};

module.exports = bridge;