var $ = require('zepto');
var discount = require('../discount/index.js');
var Bridge = require('Bridge');

var baseSize = 16,
    baseWidth = 320,
    width = $('body').width(),
    size = baseSize;
size = baseSize * width / baseWidth;
$('html').css({
    'font-size': size + 'px'
});

$(window).on('resize', function() {
    width = $('body').width();
    size = baseSize * width / baseWidth;
    $('html').css({
        'font-size': size + 'px'
    });
});

function header() {
    this.init();
}

var getSid;

$.extend(header.prototype, {

    cityMap: {
        '100010000': '100000000',
        '200010000': '200000000',
        '900010000': '900000000',
        '500010000': '500000000'
    },

    //初始化函数，自动调用
    init: function() {
        var self = this;
        new discount();
        self._setSize();
        self._bind();
        self.getCityCode();
    },

    //绑定事件相关
    _bind: function() {
        var self = this;

        $('body').on('citycode-ready', function(e, data) {
            self._handelCityCodeReady(data, self);
        });
        $(self).on('citycode-fail', function(e) {
            self._handelCityCodeFail(self);
        });
        $('.J_Selectcity').on('tap', function() {
            $('#J_province-flayer').show();
        });
        $('body').on('tap', '.J_province-close', function() {
            $('#J_province-flayer').hide();
        });
        $('body').on('tap', '.province-li', function(e) {
            var dom = $(e.currentTarget);
            var citycode = $(dom).attr('data-poid');
            var city = $(dom).attr('data-sname');
            var cityid = $(dom).attr('data-cityid');

            sessionStorage.setItem('cityId', cityid);
            sessionStorage.setItem('city', city);
            sessionStorage.setItem('cityCode', citycode);

            getSid = false;
            $('body').trigger('citycode-ready', { "cityCode": citycode, "city": city, "cityId": cityid });
            setTimeout(function() {
                $('#J_province-flayer').hide();
            }, 500);
        });
    },

    _getSidByCityId: function(cityid) {
        var self = this;
        $.ajax({
            url: window.host + "/business/ajax/dailysale/getsidbycityid?map_city_id=" + cityid,
            method: "get",
            dataType: 'jsonp',
            success: function(res) {
                if (res.errno == 0) {
                    var sid = res.data.sid;
                    $('body').trigger('sid-ready', { "sid": sid, "cityId": cityid });
                } else {
                    $('body').trigger('sid-ready', { "sid": '795ac511463263cf7ae3def3', "cityId": cityid });
                }
            },
            fail: function() {
                $('body').trigger('sid-ready', { "sid": '795ac511463263cf7ae3def3', "cityId": cityid });
            }
        });
    },

    //citycode准备好之后的响应函数
    _handelCityCodeReady: function(data, self) {
        //找到相关的省市，标红
        $('li.province-li').removeClass('province-li-active');
        $('li[data-poid="' + data.cityCode + '"]').addClass("province-li-active");
        $('.J_Selectcity .c2').html(data.city);
        //找到省市的id
        if (!getSid) {
            getSid = true;
            self._getSidByCityId(data.cityId);
        }
    },

    //citycode失败之后的响应函数
    _handelCityCodeFail: function(self) {
        self.getCityCodeByMap();
    },

    //获取当前的citycode
    getCityCode: function() {
        var self = this;

        var cityid = sessionStorage.getItem('cityId');
        var citycode = sessionStorage.getItem('cityCode');
        var city = sessionStorage.getItem('city');

        if (cityid && citycode && city) {
            setTimeout(function() { //增加延迟是为了防止其它 js 还没加载就已经触发了citycode-ready
                $('body').trigger('citycode-ready', { "cityCode": citycode, "city": city, "cityId": cityid });
            }, 100);
        } else {
            Bridge.getCity(function(res) {
                if (!res.cityId || !res.city) {
                    res.cityId = '131';
                    res.city = "北京";
                    res.cityCode = "100000000";
                }
                $('body').trigger('citycode-ready', res);
            }, function() {
                $(self).trigger('citycode-fail');
            })
        }
    },

    getCityCodeByMap: function() {
        var self = this;
        var citycode;
        //通过map的接口拿到当前的codecode
        nativeAppAdapter.getCity(function(data) {
            var cityid = data.id; //131
            var city = data.province;
            $.ajax({
                url: 'http://lvyou.baidu.com/business/ajax/ticket/Getpromotionscene?promotion_scene_type=map_scope&promotion_scene_key=' + cityid,
                type: 'get',
                dataType: 'jsonp',
                success: function(res) {
                    if (res.errno == 0) {
                        citycode = res.data.promotion_now.city_code;
                        $('body').trigger('citycode-ready', { "cityCode": citycode, "city": city, "cityId": cityid });
                    }
                }
            });
        });
    },

    _setSize: function() {
        $('.header .banner, .header .banner .shadow').css('padding_bottom', padding_bottom);
    }

});

new header();
