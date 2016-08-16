var $ = require('zepto');
var Juicer = require('juicer');
window.Bridge = require('Bridge');

function discount() {
    this.init();
}

$.extend(discount.prototype, {
    cacheData: {
        citycode: 100000000,
        cityid: 131,
        sname: "北京",
        sid: '795ac511463263cf7ae3def3',
        tag: '徒步'
    },

    params: {
        device_from: 'webapp',
        ext_from: 'zm_promotion',
        from: 'zm_promotion',
        innerfr: 'zm_promotion',
        src_from: 'zm_promotion',
        activity_name: 'zm_promotion',
        activity_id: 'zm_promotion',
        request_fr: 'zm_promotion'
    },

    init: function() {
        var self = this;
        Bridge.Data.getData(function(res) {
            self.params = $.extend(self.params, res);
            self.cacheData.sid = res.sid || self.cacheData.sid;
            self.cacheData.sname = res.sname || self.cacheData.sname;
            delete self.params.sid;
            delete self.params.sname;
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
            if (Bridge.isBaiduMap()) {
                self.params.ldata = '{"src_from":"zhoumo_promotion","activity_id":"zhoumo_promotion"}';
            }
            self._bind();
            self.loadData();
        });
    },

    reSizeImg: function(opts) {
        var self = this,
            _settings = opts || {},
            type = _settings.type || 'recommendData',
            data;
        if (type == 'recommendData') {
            data = self.cacheData.recommendData[self.cacheData.sid];
            $.each(data, function(index, item) {
                item['picUrl'] = 'http://webmap1.map.bdimg.com/maps/services/thumbnails?width=220&height=100&quality=100&align=middle,middle&src=' + item['picUrl'];
            });
        }
        return self;
    },

    _bind: function() {
        var self = this,
            _params = $.extend({
                popRoot: 'no'
            }, self.params);
        $('body').on('tap', '.J-item', function() { //进入poi详情页
            var uid = $(this).data('uid'),
                td_id = $(this).data('td_id');
            Bridge.pushWindow({
                page: 'poiDetail',
                data: {
                    nuomi: $.extend({
                        td_id: td_id
                    }, _params),
                    map: $.extend({
                        'uid': uid
                    }, _params),
                    'nuomi-webapp': $.extend({
                        td_id: td_id
                    }, _params),
                    'map-webapp': $.extend({
                        uid: uid,
                        qt: 'ninf',
                        industry: 'scope'
                    }, _params)
                }
            });
        });
    },

    getRecommendData: function(opts) {
        var self = this,
            _settings = opts || {},
            tag = $('.J-tag').html() || self.cacheData.tag,
            _dataReady = function() {
                self.renderRecommendData();
            };
        self.cacheData.recommendData = self.cacheData.recommendData || {};
        if (self.cacheData.recommendData[self.cacheData.sid]) {
            _dataReady();
            return false;
        }
        Bridge.Loader.get({
            url: Bridge.host + '/business/ajax/weekend/Getrecommenddata',
            dataType: 'jsonp',
            data: {
                sid: self.cacheData.sid,
                tag: tag
            },
            success: function(res) {
                if (res.errno != 0) {
                    alert('getRecommendData:' + res.msg);
                    return false;
                }
                self.cacheData.recommendData[self.cacheData.sid] = res.data.list || [];
                self.reSizeImg({
                    type: 'recommendData'
                });
                _dataReady();
            },
            fail: function() {
                // alert('失败啦');
            }
        });
        return self;
    },

    renderRecommendData: function() {
        var self = this,
            html = '',
            tpl = [
                '<div class="selectline">',
                '{@each cacheData.recommendData[cacheData.sid] as item,index}',
                '<div class="item J-item" data-td_id="${item.td_id}" data-uid="${item.uid}">',
                '<div class="photo">',
                '<span class="photo-wrap" data-picUrl="${item.picUrl}"><img src="${item.picUrl}" alt=""></span>',
                '<div class="tag"><span></span>${item.city}</div>',
                // '<div class="youhui"><span>立减10元</span></div>',
                '<div class="youhui"><span>优惠券</span></div>',
                '</div>',
                '<div class="name">${item.poiName}</div>',
                '<div class="price">￥${item.minPrice}元起</div>',
                '</div>',
                '{@/each}',
                '</div>'
            ].join('');
        if (self.cacheData.recommendData[self.cacheData.sid].length < 1) {
            return false;
        }
        html = Juicer(tpl, {
            cacheData: self.cacheData
        });
        $('.J-selectlist').html('');
        $(html).prependTo('.J-selectlist');
        $('.J-select').show();
        return self;
    },

    loadData: function(opts) {
        var self = this,
            _settings = opts || {};
        self.getRecommendData();
        return self;
    }
});

new discount();
