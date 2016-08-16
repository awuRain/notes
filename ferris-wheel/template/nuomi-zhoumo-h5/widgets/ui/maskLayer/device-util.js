/**
 * 只有和手机设备相关的代码
 *
 */

'use strict';
module.exports = {
    /**
     * 判断是否为android系统
     * @returns {boolean}
     */
    isAndroid: function() {
        return (/android/i).test(navigator.userAgent);
    },

    /**
     * 判断是否为IOS平台
     * @returns {boolean}
     */
    isIOS: function() {
        return (/iphone|ipad|ipod/i).test(navigator.userAgent);
    },
    /**
     * 判断是否为iphone
     * @returns {boolean}
     */
    isIPhone: function() {
        return (/iphone/i).test(navigator.userAgent);
    },
    /**
     * 判断是否为ipad
     * @returns {boolean}
     */
    isIPad: function() {
        return (/ipad/i).test(navigator.userAgent);
    },
    /**
     * 判断IOS版本(暂时只是区别是否是ios7)
     * @returns {boolean}
     */
    getIosVersion: function() {
        return (/OS 7_\d[_\d]* like Mac OS X/i).test(navigator.userAgent);
    }
}
