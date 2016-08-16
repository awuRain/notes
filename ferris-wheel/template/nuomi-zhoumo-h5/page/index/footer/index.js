var $ = require('zepto');
var Juicer = require('juicer');
var header = require('../header/index.js');

function footer() {
    this.init();
}

$.extend(footer.prototype, {
    cacheData: {},

    params: {},

    init: function() {
        var self = this;
        self._bind();
    },

    _bind: function() {
        var self = this;

        $('body').on('locationReady', function(e, data) { //定位完成
            $.extend(self.cacheData, data);
            self.params = $.extend({
                popRoot: 'no'
            }, self.cacheData.params);
            self.loadData();
        }).on('procinceChanged', function(e, data) { //省份切换完成
            $.extend(self.cacheData, data);
            self.loadData();
        }).on('tap', '.J-more-jingDian', function() { //更多热门景点
            var _sid = self.cacheData.gps_sid,
                _cityid = self.cacheData.gps_cityid,
                _timeout = 0;

            if (self.gps == 0) { //定位失败
                _timeout = 3000;
            }

            setTimeout(function() {
                if (self.gps == 0) { //定位失败
                    Bridge.toast('亲~定位失败了哟~~~');
                }
                Bridge.pushWindow({
                    page: 'poiList',
                    data: {
                        nuomi: $.extend({
                            sid: _sid,
                            tag_id: 0
                        }, self.params),
                        'nuomi-webapp': $.extend({
                            sid: _sid
                        }, self.params),
                        'map-webapp': $.extend({
                            c: _cityid
                        }, self.params)
                    }
                });
            }, _timeout);
        });
    },

    loadData: function(opts) {
        var self = this,
            _settings = opts || {};
        // self.getGuessdata();
        return self;
    }
});


new footer();
