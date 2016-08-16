var $ = require('zepto');
var Juicer = require('juicer');
var Bridge = require('Bridge');

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
                Bridge.toLogin({
                    success : function () {
                        location.reload(1);
                    }
                })
                return false;
            }
            if ($couponitem.hasClass('get') || $couponitem.hasClass('out')) {
                return;
            }   

            /*发送请求*/
            $.ajax({
                url : window.host + url_get,
                type : 'POST',
                dataType : 'json',
                data : {
                    type : id,
                    activity_name : activity_name,
                    na_from : 'nuomi_scope'
                },
                success: function(res) {

                    if (res.errno != 0) {
                        Bridge.toast(res.msg);
                        return false;
                    }
                    if (res.data.is_success == 1) {
                        $couponitem.addClass('get').find('.J-status').text('已领取');
                    } else {
                        Bridge.toast(res.data.err_msg);
                        if (res.data.err_no == '100013') {
                            $couponitem.addClass('get').find('.J-status').text('已领取');
                        } else if (res.data.err_no == '10006') {
                            $couponitem.addClass('out').find('.J-status').text('已领完');
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
        $.ajax({
            url: window.host + url_state,
            type : 'GET',
            dataType : 'json',
            data: {
                activity_name: activity_name,
                na_from: 'nuomi_scope'
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
