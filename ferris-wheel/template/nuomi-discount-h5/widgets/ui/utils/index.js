/**
 * 工具类
 * @author 闫斌(yanbin01@baidu.com)
 */

var Util = {
    /**
     * @description	localStorage缓存处理
     * @param {string} name	参数名称
     */
    locStorage: {
        supportLocalStorage: function () {
            var test = 'test';
            try {
                localStorage.setItem(test, test);
                localStorage.removeItem(test);
                return true;
            } catch (e) {
                return false;
            }
        },

        supportSessionStorage: function () {
            var test = 'test';
            try {
                sessionStorage.setItem(test, test);
                sessionStorage.removeItem(test);
                return true;
            } catch (e) {
                return false;
            }
        },
        set : function (key, value) {
            if (this.supportLocalStorage) {
                localStorage.setItem(key, value);
            }else if(this.supportSessionStorage){
                sessionStorage.setItem(key, value);
            }
        },
        get : function (key) {
            if (this.supportLocalStorage) {
                return localStorage.getItem(key);
            }else if(this.supportSessionStorage){
                return sessionStorage.getItem(key);
            }
        },
        removeItem : function (key) {
            if (this.supportLocalStorage) {
                return localStorage.removeItem(key);
            }else if(this.supportSessionStorage){
                return sessionStorage.removeItem(key);
            }
        },
        isSupport : function (key) {
            return this.supportLocalStorage || this.supportSessionStorage;
        }
    },
    /**
     * @description 时间格式化
     * @param format	指定的时间格式
     * @param timestamp	时间戳，秒(10位)或毫秒(13位)
     * @returns {*}
     */
    date: function (format, timestamp) {
        timestamp = String(timestamp).length == 13 ? timestamp : timestamp * 1000;
        var a,
            jsdate = timestamp ? new Date(timestamp) : new Date(),
            pad = function (n, c) {
                return (n = n + '').length < c ? new Array(++c - n.length).join('0') + n : n;
            },
            txt_weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            txt_ordin = {1: 'st', 2: 'nd', 3: 'rd', 21: 'st', 22: 'nd', 23: 'rd', 31: 'st'},
            txt_months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            f = {
                //天
                d: function () {
                    return pad(f.j(), 2);
                },
                D: function () {
                    t = f.l();
                    return t.substr(0, 3);
                },
                j: function () {
                    return jsdate.getDate();
                },
                l: function () {
                    return txt_weekdays[f.w()];
                },
                N: function () {
                    return f.w() + 1;
                },
                S: function () {
                    return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th';
                },
                w: function () {
                    return jsdate.getDay();
                },
                z: function () {
                    return (jsdate - new Date(jsdate.getFullYear() + '/1/1')) / 864e5 >> 0;
                },
                //星期
                W: function () {
                    var a = f.z(), b = 364 + f.L() - a;
                    var nd2, nd = (new Date(jsdate.getFullYear() + '/1/1').getDay() || 7) - 1;

                    if (b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b) {
                        return 1;
                    } else {

                        if (a <= 2 && nd >= 4 && a >= (6 - nd)) {
                            nd2 = new Date(jsdate.getFullYear() - 1 + '/12/31');
                            return date('W', Math.round(nd2.getTime() / 1000));
                        } else {
                            return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
                        }
                    }
                },
                //月
                F: function () {
                    return txt_months[f.n()];
                },
                m: function () {
                    return pad(f.n(), 2);
                },
                M: function () {
                    t = f.F();
                    return t.substr(0, 3);
                },
                n: function () {
                    return jsdate.getMonth() + 1;
                },
                t: function () {
                    var n;
                    if ((n = jsdate.getMonth() + 1) == 2) {
                        return 28 + f.L();
                    } else {
                        if (n & 1 && n < 8 || !(n & 1) && n > 7) {
                            return 31;
                        } else {
                            return 30;
                        }
                    }
                },
                //年
                L: function () {
                    var y = f.Y();
                    return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0;
                },
                Y: function () {
                    return jsdate.getFullYear();
                },
                y: function () {
                    return (jsdate.getFullYear() + '').slice(2);
                },
                //时间
                a: function () {
                    return jsdate.getHours() > 11 ? 'pm' : 'am';
                },
                A: function () {
                    return f.a().toUpperCase();
                },
                B: function () {
                    var off = (jsdate.getTimezoneOffset() + 60) * 60;
                    var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;
                    var beat = Math.floor(theSeconds / 86.4);
                    if (beat > 1000) beat -= 1000;
                    if (beat < 0) beat += 1000;
                    if ((String(beat)).length == 1) beat = '00' + beat;
                    if ((String(beat)).length == 2) beat = '0' + beat;
                    return beat;
                },
                //小时
                g: function () {
                    return jsdate.getHours() % 12 || 12;
                },
                G: function () {
                    return jsdate.getHours();
                },
                h: function () {
                    return pad(f.g(), 2);
                },
                H: function () {
                    return pad(jsdate.getHours(), 2);
                },
                //分钟
                i: function () {
                    return pad(jsdate.getMinutes(), 2);
                },
                //秒
                s: function () {
                    return pad(jsdate.getSeconds(), 2);
                },
                //时区
                O: function () {
                    var t = pad(Math.abs(jsdate.getTimezoneOffset() / 60 * 100), 4);
                    if (jsdate.getTimezoneOffset() > 0) t = '-' + t; else t = '+' + t;
                    return t;
                },
                P: function () {
                    var O = f.O();
                    return (O.substr(0, 3) + ':' + O.substr(3, 2));
                },
                //完整的日期／时间
                c: function () {
                    return f.Y() + '-' + f.m() + '-' + f.d() + 'T' + f.h() + ':' + f.i() + ':' + f.s() + f.P();
                },
                U: function () {
                    return Math.round(jsdate.getTime() / 1000);
                }
            };
        return format.replace(/[\\]?([a-zA-Z])/g, function (t, s) {
            if (t != s) {
                //escaped
                ret = s;
            } else if (f[s]) {
                //a date function exists
                ret = f[s]();
            } else {
                //nothing special
                ret = s;
            }
            return ret;
        });
    },
    /**
     * @description 写cookie
     * @param {string} name	存入Cookie的key名称
     * @param {*} value	存入Cookie的key对应的value值
     * @param {int} expires	生命周期，单位天（将被转成GMT格林尼治时间）。如果缺省时，则Cookie的属性值不会保存在用户的硬盘中，而仅仅保存在内存当中，Cookie文件将随着浏览器的关闭而自动消失。
     * @param {string} path	定义了哪些路径下的页面可获取设置的Cookie。如果缺省时，path属性的值为'/'，则配置域下所有页面可读取该Cookie。
     * @param {string} domain	确定哪个域可获取设置的Cookie。这项设置是可选的，如果缺省时，设置Cookie的属性值为当前域。
     */
    setCookie: function (name, value, expires, path, domain) {
        expires = expires || 30;
        path = path || '/';
        domain = domain || window.location.hostname;

        var now = new Date();
        now.setTime(now.getTime() + expires * 24 * 60 * 60 * 1000);

        document.cookie = name + '=' + encodeURIComponent(value) + ';path=' + path + ';domain=' + domain + ';expires=' + now.toGMTString();
    },
    /**
     * @description 读cookie
     * @param {string} name	同setCookie
     * @return {*}
     */
    getCookie: function (name) {
        var match = new RegExp('(?:^|;\\s*)' + name + '\\=([^;]+)(?:;\\s*|$)').exec(document.cookie);
        if (match) {
            return decodeURIComponent(match[1]);
        }

        return null;
    },
    /**
     * @description 删cookie
     * @param {string} name	同setCookie
     * @param {string} path	同setCookie
     * @param {string} domain	同setCookie
     */
    deleteCookie: function (name, path, domain) {
        path = path || '/';
        domain = domain || window.location.hostname;

        var now = new Date();
        now.setTime(now.getTime() - 1000);

        document.cookie = name + '=;path=' + path + ';domain=' + domain + ';expires=' + now.toGMTString();
    },
    /**
     * parse json 报错处理
     */
    json         : {
        parse : function (data) {
            var result = null;

            try {
                result = JSON.parse(data);
            } catch (e) {

            } finally {
                return result;
            }
        }
    },
    /**
     * 某些手机使用iscroll后，会出现2次触发点击，使用400ms判断是否触发2次点击
     * @param divisionTime
     * @returns {boolean}
     */
    isOverClick  : function (divisionTime) {
        var now = new Date().getTime();

        divisionTime = divisionTime || 400;

        if (now - timeTag > divisionTime) {
            timeTag = now;
            return false;
        } else {

            timeTag = 0;
            return true;
        }
    },
    date_format: function(str){
        var date = new Date(str);
        return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
    },
    /**
     * @description 解析url，返回类location对象
     * @param {string} url  默认为当前href
     * @returns {object}
     */
    parseURL: function (url) {
        var a = document.createElement('a');
        a.href = url || window.location.href;

        var arr = a.search.match(/([\w\d-_\.]+)\=([\w\d-_\.\%]*)/ig);
        var res = {};
        
        arr && arr.length && arr.map(function(item){
            var arrItem = item.match(/([\w\d-_\.]*)\=(.*)/);
            arrItem.length>2 && (res[arrItem[1] || ''] = arrItem[2] || '');
            return a;
        });
        
        return {
            origin: a.origin,
            href: url,
            host: a.host,
            hostname: a.hostname,
            port: a.port,
            search: a.search,
            // params: eval('({'+ a.search.replace(/^\?/, '').replace(/&/g, ',').replace(/\=/g, ':').replace(/([^\,\:]+)/g, '"$1"') +'})'),
            params: res,
            protocol: a.protocol.replace(':', ''),
            file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
            hash: a.hash,
            pathname: a.pathname,//.replace(/^([^\/])/, '/$1')
            relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
            segments: a.pathname.replace(/^\//, '').split('/')
        };
    },
    getRequestParams: function(uri) {
        var search = location.search.substring(1);
        uri = uri || window.location.href;
        return search ? JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) {
            return key==="" ? value : decodeURIComponent(value);
        }) : {};
    },
    /**
     * 从location.search || location.hash 中获取查询参数对象，默认从location.search中获取
     * @param search
     * @returns {{}}
     */
    getSearchObj : function (search) {
        var _search = search || location.search;
        var queryIndex = (_search).indexOf("?");
        var obj = {};

        if (queryIndex > -1) {
            var searches = _search.substring(queryIndex + 1, _search.length).split("&");

            S.each(searches, function (v, k) {
                var pair = v.split("=");

                obj[pair[0].toString()] = pair[1];
            });
        }

        return obj;
    },

    absoultePath: function(href) {
        var url = href || location.href;
        var link = document.createElement('a');
        link.href = url;
        var pathname = link.pathname;
        var full_path_path = pathname.match(/((?:[\w\d-_]+))/ig);
        var base_path = ['static', 'hybrid', 'page','var','mobile','Containers','Bundle','Application','TravelApp','app','www'];
        var page_path = full_path_path.filter(function(module, index){
            if($.inArray(module, base_path) < 0 && index != arguments[2].length-1){
                return module;
            }
        });
        var res = {
            protocol: link.protocol,
            host: link.host,
            pathname: pathname,
            page_path: page_path,
            search: link.search,
            hash: link.hash,
            pathname: link.pathname,
            absoultePath: (link.protocol + '//' + link.host + link.pathname + link.search + link.hash)
        };
        return res;
    },

    /**
     * @description 返回字符串长度(一汉字长度为2)
     * @param {string} str	字符串
     * @returns {Number}	返回字符串长度
     */
    strlen: function (str) {
        var u = str.match(/[^\x00-\xff]/g);
        return str.length + (u ? u.length : 0);
    },
    /**
     * @description 触发页面重绘
     */
    reflow       : function () {
        document.body.style.zoom = '1.0001';
        setTimeout(function () {
            document.body.style.zoom = '1';
        }, 100);
    },
    /**
     * @description 截取字符串(一汉字长度为2，不足一个汉字舍掉)
     * @param {string} str	字符串
     * @param {int} start	规定在字符串的何处开始，可省略
     * @param {int} length	规定要返回的字符串长度，暂不支持负数
     * @returns {string}	返回指定的部分字符串
     */
    substr: function (str, start, length) {
        //非常规处理
        if (!str) {
            return '';
        }

        //单双字节计数
        var a = 0,
            t = '',
            s = str.substr(start, length);
        //全单字节字符串直接返回
        if (this.strlen(s) === length) {
            return s;
        }

        if(length){
            length	+= start;
        }

        for (var i = 0, l = str.length; i < l; i++) {
            //双字节+2,单字节+1
            a += str.charCodeAt(i) > 255 ? 2 : 1;
            //计数大于指定长度直接返回截取的字符串
            if (length && a > length) {
                return t;
            }

            if(start < a){
                //未指定length，满足start后返回
                if(!length){
                    return str.substr(i);
                }

                t += str.charAt(i);
            }
        }
    },

    // dylan.zy 判断对象是否为空
    isEmpty : function(obj){
        for (var name in obj)
        {
            return false;
        }
        return true;
    },
    isOwnEmpty : function(obj){
        for(var name in obj)
        {
            if(obj.hasOwnProperty(name))
            {
                return false;
            }
        }
        return true;
    },
    isArray : function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    },
    /**
     * @description   根据字符串生成md5值
     * @param {string}    str字符串
     * @return {string}    md5值
     **/
    md5 : function(str){
        var rotateLeft = function(lValue, iShiftBits) {
          return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }
        var addUnsigned = function(lX, lY) {
          var lX4, lY4, lX8, lY8, lResult;
          lX8 = (lX & 0x80000000);
          lY8 = (lY & 0x80000000);
          lX4 = (lX & 0x40000000);
          lY4 = (lY & 0x40000000);
          lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
          if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
          if (lX4 | lY4) {
            if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
          } else {
            return (lResult ^ lX8 ^ lY8);
          }
        }
        var F = function(x, y, z) {
          return (x & y) | ((~ x) & z);
        }
        var G = function(x, y, z) {
          return (x & z) | (y & (~ z));
        }
        var H = function(x, y, z) {
          return (x ^ y ^ z);
        }
        var I = function(x, y, z) {
          return (y ^ (x | (~ z)));
        }
        var FF = function(a, b, c, d, x, s, ac) {
          a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
          return addUnsigned(rotateLeft(a, s), b);
        };
        var GG = function(a, b, c, d, x, s, ac) {
          a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
          return addUnsigned(rotateLeft(a, s), b);
        };
        var HH = function(a, b, c, d, x, s, ac) {
          a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
          return addUnsigned(rotateLeft(a, s), b);
        };
        var II = function(a, b, c, d, x, s, ac) {
          a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
          return addUnsigned(rotateLeft(a, s), b);
        };
        var convertToWordArray = function(string) {
          var lWordCount;
          var lMessageLength = string.length;
          var lNumberOfWordsTempOne = lMessageLength + 8;
          var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
          var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
          var lWordArray = Array(lNumberOfWords - 1);
          var lBytePosition = 0;
          var lByteCount = 0;
          while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
          }
          lWordCount = (lByteCount - (lByteCount % 4)) / 4;
          lBytePosition = (lByteCount % 4) * 8;
          lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
          lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
          lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
          return lWordArray;
        };
        var wordToHex = function(lValue) {
          var WordToHexValue = "", WordToHexValueTemp = "", lByte, lCount;
          for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValueTemp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
          }
          return WordToHexValue;
        };
        var uTF8Encode = function(string) {
          string = string.replace(/\x0d\x0a/g, "\x0a");
          var output = "";
          for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
              output += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
              output += String.fromCharCode((c >> 6) | 192);
              output += String.fromCharCode((c & 63) | 128);
            } else {
              output += String.fromCharCode((c >> 12) | 224);
              output += String.fromCharCode(((c >> 6) & 63) | 128);
              output += String.fromCharCode((c & 63) | 128);
            }
          }
          return output;
        };
        return function(str){
            var x = Array();
            var k, AA, BB, CC, DD, a, b, c, d;
            var S11=7, S12=12, S13=17, S14=22;
            var S21=5, S22=9 , S23=14, S24=20;
            var S31=4, S32=11, S33=16, S34=23;
            var S41=6, S42=10, S43=15, S44=21;
            string = uTF8Encode(str);
            x = convertToWordArray(string);
            a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
            for (k = 0; k < x.length; k += 16) {
              AA = a; BB = b; CC = c; DD = d;
              a = FF(a, b, c, d, x[k+0],  S11, 0xD76AA478);
              d = FF(d, a, b, c, x[k+1],  S12, 0xE8C7B756);
              c = FF(c, d, a, b, x[k+2],  S13, 0x242070DB);
              b = FF(b, c, d, a, x[k+3],  S14, 0xC1BDCEEE);
              a = FF(a, b, c, d, x[k+4],  S11, 0xF57C0FAF);
              d = FF(d, a, b, c, x[k+5],  S12, 0x4787C62A);
              c = FF(c, d, a, b, x[k+6],  S13, 0xA8304613);
              b = FF(b, c, d, a, x[k+7],  S14, 0xFD469501);
              a = FF(a, b, c, d, x[k+8],  S11, 0x698098D8);
              d = FF(d, a, b, c, x[k+9],  S12, 0x8B44F7AF);
              c = FF(c, d, a, b, x[k+10], S13, 0xFFFF5BB1);
              b = FF(b, c, d, a, x[k+11], S14, 0x895CD7BE);
              a = FF(a, b, c, d, x[k+12], S11, 0x6B901122);
              d = FF(d, a, b, c, x[k+13], S12, 0xFD987193);
              c = FF(c, d, a, b, x[k+14], S13, 0xA679438E);
              b = FF(b, c, d, a, x[k+15], S14, 0x49B40821);
              a = GG(a, b, c, d, x[k+1],  S21, 0xF61E2562);
              d = GG(d, a, b, c, x[k+6],  S22, 0xC040B340);
              c = GG(c, d, a, b, x[k+11], S23, 0x265E5A51);
              b = GG(b, c, d, a, x[k+0],  S24, 0xE9B6C7AA);
              a = GG(a, b, c, d, x[k+5],  S21, 0xD62F105D);
              d = GG(d, a, b, c, x[k+10], S22, 0x2441453);
              c = GG(c, d, a, b, x[k+15], S23, 0xD8A1E681);
              b = GG(b, c, d, a, x[k+4],  S24, 0xE7D3FBC8);
              a = GG(a, b, c, d, x[k+9],  S21, 0x21E1CDE6);
              d = GG(d, a, b, c, x[k+14], S22, 0xC33707D6);
              c = GG(c, d, a, b, x[k+3],  S23, 0xF4D50D87);
              b = GG(b, c, d, a, x[k+8],  S24, 0x455A14ED);
              a = GG(a, b, c, d, x[k+13], S21, 0xA9E3E905);
              d = GG(d, a, b, c, x[k+2],  S22, 0xFCEFA3F8);
              c = GG(c, d, a, b, x[k+7],  S23, 0x676F02D9);
              b = GG(b, c, d, a, x[k+12], S24, 0x8D2A4C8A);
              a = HH(a, b, c, d, x[k+5],  S31, 0xFFFA3942);
              d = HH(d, a, b, c, x[k+8],  S32, 0x8771F681);
              c = HH(c, d, a, b, x[k+11], S33, 0x6D9D6122);
              b = HH(b, c, d, a, x[k+14], S34, 0xFDE5380C);
              a = HH(a, b, c, d, x[k+1],  S31, 0xA4BEEA44);
              d = HH(d, a, b, c, x[k+4],  S32, 0x4BDECFA9);
              c = HH(c, d, a, b, x[k+7],  S33, 0xF6BB4B60);
              b = HH(b, c, d, a, x[k+10], S34, 0xBEBFBC70);
              a = HH(a, b, c, d, x[k+13], S31, 0x289B7EC6);
              d = HH(d, a, b, c, x[k+0],  S32, 0xEAA127FA);
              c = HH(c, d, a, b, x[k+3],  S33, 0xD4EF3085);
              b = HH(b, c, d, a, x[k+6],  S34, 0x4881D05);
              a = HH(a, b, c, d, x[k+9],  S31, 0xD9D4D039);
              d = HH(d, a, b, c, x[k+12], S32, 0xE6DB99E5);
              c = HH(c, d, a, b, x[k+15], S33, 0x1FA27CF8);
              b = HH(b, c, d, a, x[k+2],  S34, 0xC4AC5665);
              a = II(a, b, c, d, x[k+0],  S41, 0xF4292244);
              d = II(d, a, b, c, x[k+7],  S42, 0x432AFF97);
              c = II(c, d, a, b, x[k+14], S43, 0xAB9423A7);
              b = II(b, c, d, a, x[k+5],  S44, 0xFC93A039);
              a = II(a, b, c, d, x[k+12], S41, 0x655B59C3);
              d = II(d, a, b, c, x[k+3],  S42, 0x8F0CCC92);
              c = II(c, d, a, b, x[k+10], S43, 0xFFEFF47D);
              b = II(b, c, d, a, x[k+1],  S44, 0x85845DD1);
              a = II(a, b, c, d, x[k+8],  S41, 0x6FA87E4F);
              d = II(d, a, b, c, x[k+15], S42, 0xFE2CE6E0);
              c = II(c, d, a, b, x[k+6],  S43, 0xA3014314);
              b = II(b, c, d, a, x[k+13], S44, 0x4E0811A1);
              a = II(a, b, c, d, x[k+4],  S41, 0xF7537E82);
              d = II(d, a, b, c, x[k+11], S42, 0xBD3AF235);
              c = II(c, d, a, b, x[k+2],  S43, 0x2AD7D2BB);
              b = II(b, c, d, a, x[k+9],  S44, 0xEB86D391);
              a = addUnsigned(a, AA);
              b = addUnsigned(b, BB);
              c = addUnsigned(c, CC);
              d = addUnsigned(d, DD);
            }
            var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
            return tempValue.toLowerCase();
        }(str)
    },
    /**
     * @description 切图
     * @param {string} imgurl  图片url
     * @param {options} opt   配置参数  依据http://wiki.baidu.com/pages/viewpage.action?pageId=48468241  里的所有参数都支持
     * @param {string}   baseurl    切图服务的基础url   默认为http://timg01.baidu-1img.cn/timg?lv
     * @returns {string}    返回切图后的url
     */
     thumbImage : function(img,imgurl,opt,baseurl){
        if(!imgurl)return "no imgurl";
        if(/^file:\/\//.test(imgurl)==true){
            //offline
            this.loadImage(imgurl,function(){
                //成功
                var image = this,
                    width,height,
                    dev = parseInt(window.devicePixelRatio) || 1, 
                    size = opt.size || "100_100";
                width = size.split("_")[0]/dev;
                height = size.split("_")[1]/dev;

                if (image.width/image.height >= width/height) {

                    img.width = image.width * height / image.height;
                    img.height = height;     
                    // img.style.marginLeft = '-' + (image.width - width)/2 + 'px';               
                } else {
                    img.height = image.height * width / image.width;
                    img.width = width;
                    // img.style.marginTop = '-' + (image.height - height)/2 + 'px';
                }
                img.src = imgurl;
                opt.success&&opt.success(img)
            },function(){
                //失败
                opt.error&&opt.error(img);
            })
        }else{
            //online
            var baseurl = baseurl || "http://timg01.baidu-1img.cn/timg?lv",
                key = "wisetimgkey",
                sec = opt.timer || parseInt(new Date().getTime()/1000),
                src = imgurl,
                di = this.md5(key+""+sec+""+decodeURIComponent(src)),
                parms = [],
                opt = $.extend({
                    size : "100_100",
                    quality:100,
                    er:"1"
                },opt),
                opts = {
                    sec:sec,
                    di:di,
                    src:src
                },url;
            for(var key in opt){
                if(key=="success"||key=="error")continue;
                if(key=="size"){
                    parms.push(key+'=f'+opt[key]);    
                }else{
                    parms.push(key+'='+opt[key]);    
                }
            }
            for(var item in opts){
                parms.push(item+'='+opts[item]);
            }
            url = baseurl+"&"+parms.join("&");
            this.loadImage(url,function(){
                img.src = url;
                opt.success(img);
            },opt.error);
        }
        
    },
    /**
     * 加载图片
     * @param {string} url
     * @param {function} callback
     */
    loadImage: function(url, callback,error) {
        var img = new Image();
        img.src = url;

        if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
            callback.call(img);
            return; // 直接返回，不用再处理onload事件
        }

        img.onload = function() {
            img.onload = null;
            callback.call(img);
        };
        img.onerror = function(){
            img.onload = null;
            error.call(img);
        }
    },
    /**
     * 获取对象属性，不存在返回默认值
     * @param {Object} o
     * @param {string} strProp
     * @param {Object} def 默认值
     * 
     * var o = {
     *     a: {
     *         b: [1,2]
     *     }
     * }
     * 
     * prop(o, "a.b");  // [1,2]
     * prop(o, "a.b.c"); // undefined
     * prop(o, "a.c", 1); // 1
     */
    prop:function(o, strProp, def) {
        var ret = def,
            props = [],
            tmp;
        if (!!o) {
            if (!!strProp) {
                props = strProp.split(".");
                try {
                    tmp = o;
                    for (var i = 0, len = props.length; i < len; i++) {
                        tmp = tmp[props[i]];
                    }
                    ret = tmp === void 0 ? def : tmp;
                } catch (e) {}
            } else {
                ret = o || ret;
            }
        }
        return ret;
    }
};

module.exports = Util;