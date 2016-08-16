var $ = require('zepto');
var Juicer = require('juicer');
var header = require('../header/index.js');

function discount() {
    this.init();
}

$.extend(discount.prototype, {
    cacheData: {},

    params: {},

    init: function() {
        var self = this;
        self._bind();
        self.header = new header();
    },

    _bind: function() {
        var self = this;

        $('body').on('locationReady', function(e, data) { //定位完成
            $.extend(self.cacheData, data);
            self.params = $.extend({
                popRoot: 'no'
            }, self.cacheData.params);
            console.log(self.cacheData.params);
            self.loadData();
        }).on('procinceChanged', function(e, data) { //省份切换完成
            $.extend(self.cacheData, data);
            self.loadData();
        }).on('tap', '.J_more', function() { //更多低价
            $('.J-guessitem').filter(function() {
                if ($(this).data('hidden') == '1') {
                    return $(this);
                }
            }).toggleClass('guessitem-hidden');
            $('.J-moreicon span').toggleClass('up');
        }).on('tap', '.J-guessitem', function() { //进入poi详情页
            var uid = $(this).data('uid'),
                td_id = $(this).data('td_id');
            Bridge.pushWindow({
                page: 'poiDetail',
                data: {
                    nuomi: $.extend({
                        td_id: td_id
                    }, self.params),
                    map: $.extend({
                        'uid': uid
                    }, self.params),
                    'nuomi-webapp': $.extend({
                        td_id: td_id
                    }, self.params),
                    'map-webapp': $.extend({
                        uid: uid,
                        qt: 'ninf',
                        industry: 'scope'
                    }, self.params)
                }
            });
        });
    },

    reSizeImg: function(opts) {
        var self = this,
            _settings = opts || {},
            type = _settings.type || 'guessData',
            data;
        if (type == 'guessData') {
            data = self.cacheData.guessData[self.cacheData.sid];
            $.each(data, function(index, item) {
                item['picUrl'] = 'http://webmap1.map.bdimg.com/maps/services/thumbnails?width=220&height=100&quality=100&align=middle,middle&src=' + item['picUrl'];
            });
        }
        return self;
    },

    getGuessdata: function(opts) {
        var self = this,
            _settings = opts || {},
            _dataReady = function() {
                self.renderGuessdata();
            };
        self.cacheData.guessData = self.cacheData.guessData || {};
        if (self.cacheData.guessData[self.cacheData.sid]) {
            _dataReady();
            return false;
        }
        Bridge.Loader.get({
            url: Bridge.host + '/business/ajax/weekend/Getguessdatabysid',
            dataType: 'jsonp',
            data: {
                sid: self.cacheData.sid
            },
            success: function(res) {
                if (res.errno != 0) {
                    alert('getGuessdata:' + res.msg);
                    return false;
                }
                self.cacheData.guessData[self.cacheData.sid] = res.data.list || [];
                self.cacheData.guessDataMax = 10;
                self.reSizeImg({
                    type: 'guessData'
                });
                _dataReady();
            },
            fail: function() {
                // alert('失败啦');
            }
        });
        return self;
    },

    renderGuessdata: function() {
        var self = this,
            html = '',
            tpl = [
                '<%',
                'var is_show = 1;',
                '%>',
                '<div class="guessline">',
                '{@each cacheData.guessData[cacheData.sid] as item,index}',
                '<%',
                'if(index >= cacheData.guessDataMax){',
                'is_show = 0;',
                '}',
                '%>',
                '<div class=\"guessitem J-guessitem ${is_show == 0 ? "guessitem-hidden" : ""}\" ${is_show == 0 ? "data-hidden=1" : ""} data-td_id="${item.td_id}" data-uid="${item.uid}" pb_id="' + window.discountTapLog + '">',
                '<div class="photowrap" data-picUrl="${item.picUrl}">',
                '<img src="${item.picUrl}" alt="">',
                '<div class="tag">优惠券</div>',
                '</div>',
                '<div class="namewrap">',
                '<div class="name">${item.poiName}</div>',
                '<div class="price">￥${item.minPrice}起</div>',
                '</div>',
                '</div>',
                '{@/each}',
                '</div>',
                '{@if cacheData.guessData[cacheData.sid].length > cacheData.guessDataMax}',
                '<div class="more J_more" pb_id="' + window.moretabLogId + '">',
                '<div class="moretxt">更多低价</div>',
                '<div class="moreicon J-moreicon"><span></span></div>',
                '</div>',
                '{@/if}'
            ].join('');
        html = Juicer(tpl, {
            cacheData: self.cacheData
        });
        $('.J-guesslist').html('');
        $(html).prependTo('.J-guesslist');
        return self;
    },

    loadData: function(opts) {
        var self = this,
            _settings = opts || {};
        self.getGuessdata();
        return self;
    }
});


new discount();
