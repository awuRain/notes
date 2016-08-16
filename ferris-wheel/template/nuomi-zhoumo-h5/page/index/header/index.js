var $ = require('zepto');
//var Bridge = require('Bridge');
var Juicer = require('juicer');
var Tracker = require('Tracker');

//统计pv uv
Tracker.init({
    module: 'index',
    page: window.eventId
});

Tracker.pvLog();

function header() {
    this.init();
}

var getSid;

$.extend(header.prototype, {
    cacheData: {
        params: {
            device_from: 'webapp',
            ext_from: 'zm_promotion',
            from: 'zm_promotion',
            innerfr: 'zm_promotion',
            src_from: 'zm_promotion',
            activity_name: 'zm_promotion',
            activity_id: 'zm_promotion',
            request_fr: 'zm_promotion'
        }
    },
    cityMap: {
        '100010000': '100000000',
        '200010000': '200000000',
        '900010000': '900000000',
        '500010000': '500000000'
    },

    //初始化函数，自动调用
    init: function() {
        var self = this;
        Bridge.Data.getData(function(res) {
            self.cacheData.params = res;
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
                self.cacheData.params.ldata = '{"src_from":"zhoumo_promotion","activity_id":"zhoumo_promotion"}';
            }

            if (location.host == 'map.baidu.com' || self.cacheData.params['na_from'] == 'map_scope') {
                self.cacheData.params.channel = "map_scope";
            } else if (location.host == 'lvyou.baidu.com' || self.cacheData.params['na_from'] == 'nuomi') {
                self.cacheData.params.channel = "nuomi";
            } else {
                self.cacheData.params.channel = "nuomi";
            }

            self._bind();
            self.getProvince();
            self.showLog();
        });
    },

    disbleMove: function(e) {
        e.preventDefault();
        return false;
    },

    pageNotMove: function() {
        var self = this;
        $('body').addClass('notmove');
        $('html').addClass('notmove');
        //$('body').on('touchmove', self.disbleMove);
    },

    pageCanMove: function() {
        var self = this;
        $('body').removeClass('notmove');
        $('html').removeClass('notmove');
        //$('body').off('touchmove', self.disbleMove);
    },

    //绑定事件相关
    _bind: function() {
        var self = this;
        $('body').on('locationReady', function(e, data) { //定位完成
            // if (self.re_gps == 1) {
            //     $('.J-noactivity').show();
            // }
            if (self.gps == 0) {
                $('#J_province-flayer').show();
                self.pageNotMove();
            }
            self.loadData();
        }).on('procinceChanged', function(e, data) { //省份切换完成

        }).on('tap', '.J_Selectcity', function() {
            $('#J_province-flayer').show();
            self.pageNotMove();
        }).on('tap', '.J_province-close', function() {
            $('#J_province-flayer').hide();
            self.pageCanMove();
        }).on('tap', '.J-rule-btn', function() {
            $('#J-rule').show();
            self.pageNotMove();
        }).on('tap', '.J_rule-close', function() {
            $('#J-rule').hide();
            self.pageCanMove();
        }).on('tap', '.province-li', function(e) { //省份切换
            var dom = $(e.currentTarget);
            var sname = $(dom).data('sname');
            var citycode = $(dom).data('poid');
            var cityid = $(dom).data('cityid');
            var sid = $(dom).data('sid');
            self.cacheData.sid = sid;
            self.cacheData.sname = sname;
            self.cacheData.citycode = citycode;
            self.cacheData.cityid = cityid;
            sessionStorage.setItem('cityid', self.cacheData.cityid);
            sessionStorage.setItem('sname', self.cacheData.sname);
            sessionStorage.setItem('citycode', self.cacheData.citycode);
            sessionStorage.setItem('sid', self.cacheData.sid);
            self.loadData();
            $('body').trigger('procinceChanged', [self.cacheData]);
            setTimeout(function() {
                $('#J_province-flayer').hide();
                self.pageCanMove();
            }, 500);
        });
    },

    getProvince: function() {
        var self = this,
            _dataReady = function() {
                $('body').trigger('locationReady', [self.cacheData]);
            },
            _cityid = sessionStorage.getItem('cityid') || '',
            _sname = sessionStorage.getItem('sname') || '',
            _citycode = sessionStorage.getItem('citycode') || '',
            _sid = sessionStorage.getItem('sid') || '',
            _fun = function(opts) {
                if (_times > 0) { //防止重复初始化
                    return false;
                }
                clearTimeout(_timeout);
                var _settings = opts || {};
                self.cacheData.sname = _settings.sname.replace('市', '') || '';
                self.cacheData.sid = _settings.sid || '';
                if (self.cacheData.sid.length == 0 || self.cacheData.sname.length == 0) {
                    self.gps = 0; //标记定位失败
                } else {
                    self.gps = 1;
                }
                var res = {
                        errno: 0,
                        msg: "",
                        data: {
                            promotion_type: "province",
                            promotion_list: [{
                                citycode: 100000000,
                                cityid: 131,
                                sname: "北京",
                                sid: '795ac511463263cf7ae3def3'
                            }, {
                                citycode: 200000000,
                                cityid: 289,
                                sname: "上海",
                                sid: '289d2b074d001b3184b27ef7'
                            }, {
                                citycode: 300000000,
                                cityid: 257,
                                sname: "广东",
                                sid: 'b0240abb6cf9c05f301acdf3'
                            }, {
                                citycode: 1500000000,
                                cityid: 127,
                                sname: "安徽",
                                sid: 'fb0af2c9c005c401f11576f3'
                            }, {
                                citycode: 1900000000,
                                cityid: 300,
                                sname: "福建",
                                sid: '55163f0fd41f9757809972f0'
                            }, {
                                citycode: 400000000,
                                cityid: 218,
                                sname: "湖北",
                                sid: '9607cc8575ed2e69961327f7'
                            }, {
                                citycode: 1200000000,
                                cityid: 158,
                                sname: "湖南",
                                sid: '2f1a4dadc1b446649c1ec9f3'
                            }, {
                                citycode: 700000000,
                                cityid: 315,
                                sname: "江苏",
                                sid: '3a89363b4ffbffdcdfcc98f4'
                            }, {
                                citycode: 1400000000,
                                cityid: 288,
                                sname: "山东",
                                sid: '4810309ea171641493d817f6'
                            }, {
                                citycode: 800000000,
                                cityid: 75,
                                sname: "四川",
                                sid: '8e8da744ec5be32fd14c6cf7'
                            }, {
                                citycode: 500000000,
                                cityid: 332,
                                sname: "天津",
                                sid: 'cc11463263cf7ae3b9d4dff3'
                            }, {
                                citycode: 600000000,
                                cityid: 179,
                                sname: "浙江",
                                sid: '9520608cbb0e13551b12a1f1'
                            }]
                        }
                    },
                    item = {};
                if (self.gps == 1) {
                    for (var index in res.data.promotion_list) {
                        item = res.data.promotion_list[index];
                        if (item.sid == self.cacheData.sid) {
                            res.data.promotion_now = $.extend({}, item);
                            break;
                        }
                    }
                    res.data.promotion_now = res.data.promotion_now || {};
                    if ($.isEmptyObject(res.data.promotion_now)) { //定位不在指定省份里
                        self.gps = 0;
                        self.re_gps = 1;
                        res.data.promotion_now = {
                            citycode: 100000000,
                            cityid: 131,
                            sname: "北京",
                            sid: '795ac511463263cf7ae3def3'
                        };
                    }
                    if (_cityid.length && _sname.length && _sid.length) {
                        self.cacheData.cityid = _cityid;
                        self.cacheData.sname = _sname;
                        self.cacheData.citycode = _citycode;
                        self.cacheData.sid = _sid;
                    } else {
                        self.cacheData.citycode = res.data.promotion_now.citycode;
                        self.cacheData.cityid = res.data.promotion_now.cityid;
                        self.cacheData.sname = res.data.promotion_now.sname;
                        self.cacheData.sid = res.data.promotion_now.sid;
                    }
                } else if (self.gps == 0) { //定位失败时使用北京作为缺省值
                    res.data.promotion_now = {
                        citycode: 100000000,
                        cityid: 131,
                        sname: "北京",
                        sid: '795ac511463263cf7ae3def3'
                    };
                    self.cacheData.citycode = res.data.promotion_now.citycode;
                    self.cacheData.cityid = res.data.promotion_now.cityid;
                    self.cacheData.sname = res.data.promotion_now.sname;
                    self.cacheData.sid = res.data.promotion_now.sid;
                }
                self.cacheData.gps_sid = self.cacheData.sid;
                self.cacheData.gps_citycode = self.cacheData.citycode;
                self.cacheData.gps_cityid = self.cacheData.cityid;
                self.cacheData.gps_sname = self.cacheData.sname;
                self.cacheData.provinceList = res.data;
                try {
                    sessionStorage.setItem('cityid', self.cacheData.cityid);
                    sessionStorage.setItem('sname', self.cacheData.sname);
                    sessionStorage.setItem('citycode', self.cacheData.citycode);
                    sessionStorage.setItem('sid', self.cacheData.sid);
                } catch (e) {

                }
                _dataReady();
                _times++;
            },
            _timeout,
            _times = 0;
        _timeout = setTimeout(function() {
            clearTimeout(_timeout);
            _fun({
                sid: '',
                sname: ''
            });
            console.warn('getProvinceSid 超时 将已北京作为默认省份');
        }, 5000);
        Bridge.getProvinceSid(function(sid) { //获取 sid
            clearTimeout(_timeout);
            sid = sid || '';
            if (sid.length <= 0) {
                _fun({
                    sid: sid,
                    sname: ''
                });
                return false;
            }
            _timeout = setTimeout(function() {
                clearTimeout(_timeout);
                _fun({
                    sid: sid,
                    sname: ''
                });
                console.warn('getCityName 超时 将已北京作为默认省份');
            }, 5000);
            Bridge.getCityName(function(sname) {
                clearTimeout(_timeout);
                sname = sname || '';
                if (sname.length <= 0) {
                    _fun({
                        sid: sid,
                        sname: sname
                    });
                    return false;
                }
                _fun({
                    sid: sid,
                    sname: sname
                });
            });
        });
        return self;
    },

    loadData: function(opts) {
        var self = this,
            _settings = opts || {};
        //找到相关的省事，标红
        $('li.province-li').removeClass('province-li-active');
        $('li[data-sid="' + self.cacheData.sid + '"]').addClass("province-li-active");
        $('.J_Selectcity .c2').html(self.cacheData.sname);
        $('.hot').html('');
        if (self.gps == 0) {
            // self._handelCityCodeFail(self);
        }
        return self;
    },

    showLog: function() {
        var self = this;
        Tracker.showLog({
            'client_type': Bridge.isBaiduMap() ? '7' : '3',
            'ext_os': Bridge.isAndroid() ? 'android' : 'ios',
            'accur_trd': self.cacheData.params.channel == "map_scope" ? 'map' : 'nuomi',
            'accur_act': 'pv',
            'accur_thirdpar': self.cacheData.params.fr,
            'accur_src': self.cacheData.params.activename || 'zm_promotion',
            'innerfr_pg': self.cacheData.params.fr,
            'innersubfr_pg': self.cacheData.params.innersubfr,
            'ext_type': 0
        });
        return self;
    }
});

module.exports = header;
