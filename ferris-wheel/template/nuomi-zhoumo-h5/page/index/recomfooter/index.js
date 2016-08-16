var $ = require('zepto');
var juicer = require('juicer');
window.Bridge = require('Bridge');

function discount() {
    this.init();
}

$.extend(discount.prototype, {
    params: {},
    init: function() {
        var self = this;
        Bridge.Data.getData(function(res) {
            self.params = res;
            delete res.uid;
            delete res.comppage;
            delete res.oem;
            delete res.channel;
            delete res.cpu;
            delete res.sv;
            delete res.os;
            delete res.resid;
            delete res.mb;
            delete res.net;
            delete res.ctm;
            delete res.glr;
            delete res.bduid;
            delete res.dpi;
            delete res.glv;
            delete res.ver;
            delete res.screen;
            delete res.cuid;
            delete res.c;
            delete res.loc;
            delete res.b;
            delete res.bc;
            delete res.ssid;

            self._bind();
        });
    },

    _bind: function() {
        var self = this,
            _params = $.extend({
                popRoot: 'no'
            }, self.params);

        /*底部回到首页*/
        $('body').on('tap', '.J-back', function() { //进入主会场
            var url = '',
                // params = $.extend(_params, _params),
                _arr = [],
                webappUrl;
            url = window.back_url ? decodeURIComponent(window.back_url) : 'http://lvyou.baidu.com/';
            webappUrl = url;
            for (var key in _params) {
                _arr.push(key + '=' + _params[key])
            }
            if (/\?/ig.test(url)) {
                webappUrl += '&' + _arr.join('&');
                url += '&' + _arr.join('&');
            } else {
                webappUrl += '?' + _arr.join('&');
                url += '?' + _arr.join('&');
            }
            Bridge.pushWindow({
                "nuomi": 'bainuo://component?url=' + url.replace('?', '&'),
                "nuomi-webapp": webappUrl,
                "map-ios": 'baidumap://map/cost_share?a=1&url=' + url,
                "map-android": 'baidumap://map/cost_share?a=1&url=' + url,
                "map-webapp": webappUrl,
                data: $.extend({}, _params)
            });
        });
    }
});


new discount();
