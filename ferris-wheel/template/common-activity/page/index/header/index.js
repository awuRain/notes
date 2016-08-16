var $ = require('zepto');
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

function header(){
    this.init();
}

$.extend(header.prototype, {

    init: function(){
        this._bind();
        this.location();
    },

    //绑定各种事件
    _bind: function(){
        var self = this;
        $('.J_Rules').on('tap', function(){
            $('.flayer').show();
        });
        $('.J-flayer-close').on('tap', function(){
            $('.flayer').hide();
        });
        $('.J-province-select').on('tap', function(){
            $('#J_province-flayer').show();
        });
        $('.J_province-close').on('tap', function(){
            $('#J_province-flayer').hide();
        });
        $('#J_province-flayer').on('tap', 'li.province-li', function(e){
            var selectCityCtn = $(e.currentTarget),
                sid = selectCityCtn.attr('data-sid');
            sessionStorage.setItem('sid', sid);
            $('body').trigger('sid-select', {sid: sid});
        });
        $('body').on('sid-select', function(event, data){
            self._handleSidSelect(data);
        });
    },

    location: function(){
        var sid = sessionStorage.getItem('sid');
        if (sid) {
            triggerSidSelect(sid);
        } else {
            Bridge.getProvinceSid(function(sid){
                triggerSidSelect(sid);
            });             
        }
        function triggerSidSelect (sid) {
            if (!sid) {
                sid = "795ac511463263cf7ae3def3";
            }
            setTimeout(function () {
                $('body').trigger('sid-select', {"sid": sid});
            }, 400);
        }
    },

    _handleSidSelect: function(data){
        var activeCityCtn = $('li[data-sid="' + data.sid + '"]');
        $('#J_province-flayer li').removeClass('province-li-active');
        activeCityCtn.addClass('province-li-active');
        $('#J_cur-pro').html(activeCityCtn.html());
        setTimeout(function(){
            $('#J_province-flayer').hide();
        }, 500);
    }
});

new header();