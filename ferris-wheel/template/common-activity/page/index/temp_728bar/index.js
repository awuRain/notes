var $ = require('zepto');
var Tracker = require('Tracker');
var juicer = require('juicer');

//统计pv uv
Tracker.init({
    module: 'index',
    page: window.eventId
});

function temp_728bar() {
    this.init();
}

$.extend(temp_728bar.prototype, {
    tpl: ''+ 
        '<footer>'+
            '<div class="trapezium"></div>'+
            '<div class="subSessionTab-wrap"></div>'+
            '<div class="footer-cont-wrap">'+
                '<div class="footer-cont">'+
                    '<a class="mainSessionTab-btn J-jumpBnr" data-link="http://lvyou.baidu.com/event/s/728_promotion/index/?fr=tiaozhuan" data-nalink="bainuo://component?url=http://lvyou.baidu.com/event/s/728_promotion/index/&fr=tiaozhuan">主会场</a>'+
                    '<a class="game-btn J-jumpBnr" data-link="https://shakeduang.nuomi.com/prizedraw/activity?ac_id=388&s=F8D1wyQHuS0" data-nalink="bainuo://web?url=https%3A%2F%2Fshakeduang.nuomi.com%2Fprizedraw%2Factivity%3Fac_id%3D388%26s%3DF8D1wyQHuS0">游戏</a>'+
                    '<a class="subSessionTab-btn">子会场</a>'+
                    '<div style="clear: both;"></div>'+
                '</div>'+
            '</div>'+
            '<div class="subSessionTab">'+
                '<span class="close-btn"></span>'+
                '<ul>'+
                    '{@each subSession as item}'+
                        '{@if item.title}'+
                            '<li><a class="J-jumpBnr" data-link="${item.link}" data-nalink="${item.nalink}" pb-id="${item["pb-id"]}">${item.title}</a></li>'+
                        '{@/if}'+
                    '{@/each}'+
                '</ul>'+
            '</div>'+
        '</footer>',
    init: function () {
        var self = this;
        self._bind();
    },
    _bind: function () {
        var self = this;
        self.loadData();
        $('body').on('tap', '.subSessionTab-btn', function() {
            $('.subSessionTab').addClass('active');
        }).on('tap', '.subSessionTab .close-btn', function() {
            $('.subSessionTab').removeClass('active');
        }).on('tap', '.J-jumpBnr', function() { //banner位点击
            var link = $(this).data('link'),
                nalink = $(this).attr('data-nalink') || '';
            if (link.length == 0) {
                return self;
            }
            $('.subSessionTab').removeClass('active');
            Bridge.pushWindow({
                // nuomi: "bainuo://component?a=1&url=" + encodeURIComponent(link),
                nuomi: /^bainuo\:/igm.test(nalink) ? nalink : "bainuo://component?a=1&url=" + encodeURIComponent(nalink),
                "nuomi-webapp": link,
                "map-webapp": link,
                "map-ios": link,
                "map-android": link
            });
        });
    },
    loadData: function () {
        var self = this;
        window.configReady = function (pageConfig) {
            console.log(pageConfig);
            $('.temp_728bar').html(juicer(self.tpl, {"pageConfig": pageConfig, "subSession": pageConfig.subSession}));
        }

        $.getJSON('http://lvyou.baidu.com/event/s/728_promotion/config-nuomi.js?callback=?', {});
    }
});

//判断是否是糯米端
function isNuomi(){
    return /Nuomi/i.test(navigator.userAgent);
}

new temp_728bar();