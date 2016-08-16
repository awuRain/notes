var $ = require('zepto');
var juicer = require('juicer');
window.Bridge = require('Bridge');

function discount() {
    this.init();
}

$.extend(discount.prototype, {
    cacheData: {},
    params: {},
    init: function() {
        var self = this;
        self._bind();
    },

    _bind: function() {
        var self = this;

        // /*绑定自定义事件，获取从header模块所取信息*/
        $('body').on('locationReady', function(e, data) { //定位完成
            self.cacheData = $.extend(self.cacheData, data);
            self.params = $.extend({
                popRoot: 'no'
            }, self.cacheData.params);
            self.loadData();
        }).on('procinceChanged', function(e, data) { //省份切换完成
            self.cacheData = $.extend(self.cacheData, data);
            self.loadData();
        }).on('tap', '.J-item', function() { //进入推荐详情页
            var url = $(this).data('link'),
                _params = $.extend({
                    // back_url: encodeURIComponent(location.href),
                }, self.params),
                _arr = [],
                webappUrl = url;
            for (var key in _params) {
                _arr.push(key + '=' + _params[key])
            }
            _arr.unshift('sid=' + self.cacheData.sid);
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
    },

    loadData: function(opts) {
        var self = this,
            _settings = opts || {},
            $takeplay = $('.J-c-takeplay'),
            $takelistItem = $('.J-takelist').find('ul').filter(function() {
                if ($(this).data('citycode') == self.cacheData.citycode) {
                    return $(this)
                }
            });
        if ($takelistItem.length) {
            $takelistItem.show().siblings('ul').hide();
            $takelistItem.find('img').filter(function() {
                var $this = $(this);
                $this.attr('src', $this.data('src'));
            });
            $takeplay.show();
        } else {
            $takeplay.hide();
        }
        return self;
    }
});


new discount();
