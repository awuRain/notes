/**
 * 只有处理url相关的代码
 *
 */
 'use strict';
module.exports = {
    /**
     * html字符编码，防止html代码注入
     * @param {string} 原始内容
     * @returns {string} 返回编码之后的内容
     */
    encodeHTML: function(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/'/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    /**
     * 将url参数部分解析成key/value形式
     * @param {string} url，格式key=value&key=value
     * @returns {Object} json对象{key:value,key:value}
     */
    urlToJSON: function(url) {
        if (!url) {
            return {};
        }
        var result = {}, pairs = url.split('&'),
            i, keyValue, len;
        for (i = 0, len = pairs.length; i < len; i++) {
            keyValue = pairs[i].split('=');
            result[keyValue[0]] = decodeURIComponent(keyValue[1]);
        }
        return result;
    },
    /**
     * json转换为url
     * @param {Object} json数据
     * @returns {string} url
     */
    jsonToUrl: function(json) {
        if (!json) {
            return '';
        }
        var arr = [],
            key;
        for (key in json) {
            if (json.hasOwnProperty(key)) {
                arr.push(key + '=' + encodeURIComponent(json[key]));
            }
        }
        return arr.join('&');
    },
    /**
     * 将json对象格式化为请求串
     * @param {Object} Json对象
     * @param {Function} 编码函数
     */
    jsonToQuery: function(json, encode) {
        var s = [],
            n, value;

        encode = encode || function(v) {
            return v;
        };
        for (n in json) {
            if (json.hasOwnProperty(n)) {
                value = json[n];
                if (value) {
                    s.push(n + '=' + encode(value));
                }
            }
        }
        return s.join('&');
    }
}

