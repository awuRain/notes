var $ = require('zepto');
var Juicer = require('juicer');

function discount() {
    this.init();
}

$.extend(discount.prototype, {
    is_login: 0,
    init: function() {
        var self = this;

        self._bind();

        Bridge.isLogin(function(status) { //检测登录状态
            self.is_login = status || 0;
            self._getcouponinfo();
        });
    },

    _bind: function() {
        var self = this;
        /*领取优惠券*/
        $('.J-couponlist').on('tap', '.J-clist', function() {

            var $couponitem = $(this),
                id = $couponitem.data('id');
            if (self.is_login != 1) {
                Bridge.toLogin()
                return false;
            }
            if ($couponitem.hasClass('get') || $couponitem.hasClass('out')) {
                return;
            }

            /*发送请求*/
            Bridge.Loader.get({
                url: Bridge.host + '/business/ajax/ticket/getmapdiscount/',
                dataType: 'jsonp',
                data: {
                    type: id,
                    activity_name: 'weekend_1',
                    na_from: 'map_scope'
                },
                success: function(res) {
                    if (res.errno != 0) {
                        Bridge.toast(res.msg);
                        return false;
                    }
                    if (res.data.is_success == 1) {
                        $couponitem.addClass('get').find('.J-status').text('已领取');
                    } else {
                        if(res.data.err_no == 2) {
                            Bridge.toast("亲，今天券已经领完了，下次再来吧！");
                        }else {
                            Bridge.toast(res.data.err_msg);
                            if (res.data.err_no == '100013') {
                                $couponitem.addClass('get').find('.J-status').text('已领取');
                            } else if (res.data.err_no == '10006') {
                                $couponitem.addClass('out').find('.J-status').text('已领完');
                            }

                        }
                    }
                },
                fail: function() {
                    alert('失败啦');
                }
            });
        });
    },

    /*获取优惠券状态*/
    _getcouponinfo: function() {
        var self = this,
            _fun = function() {
                /*遍历优惠券列表页，更改优惠券状态*/
                $('.J-couponlist .J-clist').each(function(index, item) {
                    if (_list[index + 1] && _list[index + 1].is_can_get == 0) {
                        $(item).addClass('out').find('.J-status').text('已领完');
                    }
                });
                $('.J-couponlist').show();
            },
            _list = {
                1: {
                    is_can_get: 1
                },
                2: {
                    is_can_get: 1
                },
                3: {
                    is_can_get: 1
                },
                4: {
                    is_can_get: 1
                }
            };
        if (self.is_login != 1) {
            _fun();
            return false;
        }
        Bridge.Loader.get({
            url: Bridge.host + '/business/ajax/ticket/getmapdiscountstatus/',
            dataType: 'jsonp',
            data: {
                activity_name: 'weekend_1',
                na_from: 'map_scope'
            },

            success: function(res) {
                if (res.errno == 0) {
                    _list = res.data.list;
                }

                _fun();
            },
            fail: function() {
                alert('失败啦');
            }
        });

    }
});


new discount();
