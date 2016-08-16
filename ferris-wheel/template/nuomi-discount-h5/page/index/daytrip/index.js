var $ = require('zepto');
var juicer = require('juicer');
var Bridge = require('Bridge');
var Tracker = require('Tracker');
var lite = require('ui/lite/lite');

var box_w = 0, box_h = 0;

Tracker.init({
    module: 'index',
    page: window.eventId
});
Tracker.pvLog();

function daytrip() {
    this.init();
}

$.extend(daytrip.prototype, {
    _setTpl: function() {
        var self = this;
        self.daytripTpl = '<h2 class="section-title">特价一日游</h2>'+
        '<ul>' +
        '{@each discountList as item, index}' +
            '<li class="discount-list J_daytrip-item {@if index < 5}show{@else}hideitem{@/if}" data-productId="${item.productId}" data-src="${item.src}">' +
                    '<a class="discount-list-item" href="javascript:;">' +
                    '<div class="item-banner" style="background-image:url(${item.pic})" data-original_pic="${item.original_pic}"></div>' +
                    '<div class="item-ctn">' +
                        '<div class="item-title">' +
                            '<p>${item.ticket_name}</p>' +
                            '{@if item.score||item.score==0}' +
                                '<ul class="item-stars" data-score="${item.score}">'+
                                '</ul>'+
                            '{@/if}' +
                        '</div>' +
                        '<div class="item-buy">' +
                            '<span class="price price-sale"><em>${item.sale_price}</em></span>' +
                            '<span class="price price-market"><em>${item.market_price}</em></span>' +
                            '<button>立即抢</button>' +
                        '</div>' +
                    '</div>' +
            '</a>' +
            '</li>' +
            '{@/each}' +
        '</ul>' +
        '{@if discountList.length > 5}<div class="more J_More_daytrip less_daytrip"><span class="text">查看更多</span><span class="more-arrow">▾</span></div>{@/if}';
    },
    init: function(){
        var self = this;
        self._bind();
    },

    _bind: function(){
        var self = this;
        $('body').on('citycode-ready', function(e, data){
            var citycode = data.cityCode;
            var city = data.city;
            var cityid = data.cityId;
            $('.daytrip').html('<div class="loading">数据加载中...</div>');
            self._setTpl();
            self.loadData(citycode);
        });
        $('body').on('tap', '.J_daytrip-item', function(e){ 
            var dom = $(e.currentTarget),
                productId = dom.attr('data-productId');
            Tracker.tapLog(daytripTapLog);
            Bridge.Data.getData(function (res) {
                delete res.url;
                var _param = $.extend({
                    ext_from: window.eventId
                }, res);
                Bridge.pushWindow({
                    "nuomi": 'bainuo://component?compid=lvyou&comppage=travel_detail',
                    "nuomi-webapp": Bridge.appendParam('http://lvyou.baidu.com/static/foreign/page/travel/detail/index.html?product_id=' + productId, _param),
                    "data": $.extend({"product_id": productId}, _param)
                });
            });
        });
        //点击查看更多
        $('body').on('tap', '.J_More_daytrip', function(e){
            var dom = $(e.currentTarget);
            if(dom.hasClass('less_daytrip')) {
                $('.daytrip .hideitem').css('display','block');
                dom.removeClass('less_daytrip');
                dom.find('span.text').html('收起');
                dom.find('span.more-arrow').addClass('rotate');
            }
            else {
                $('.daytrip .hideitem').css('display','none');
                dom.addClass('less_daytrip');
                dom.find('span.text').html('查看更多');
                dom.find('span.more-arrow').removeClass('rotate');
            }
        });


    },
    loadData: function(citycode){
        var self = this;
        var url = daytripUrl + citycode;
        $.ajax({
            url: url,
            type:'get',
            dataType:'jsonp',
            success: function(res){
                if (res.errno == 0) {
                    var tpl = self.daytripTpl;
                    if(res.data.length == 0) {
                        $('.daytrip').html('<h2 class="section-title">特价一日游</h2><div class="text">不好意思噢，当前城市没有特价资源，我们会火速争取！</div>');
                    }
                    else {
                        $('.daytrip').html(juicer(tpl, {
                            discountList: res.data.list
                        }));
                        self._renderStar();
                        self._fixImg();
                    }
                }
            }
        });
    },
    _fixImg: function() {
        $('.J_daytrip-item .item-banner').each(function(i, item){
            var original_pic = $(item).attr('data-original_pic');
            if(original_pic) {
                var img = new Image();
                img.onerror = function() {
                    $(item).css('background-image', 'url(http://webmap3.map.bdimg.com/maps/services/thumbnails?width='+ 200 +'&height='+ 200 +'&quality=120&align=middle,middle&src=' + original_pic + ')');
                };
                img.src = ($(item).css('background-image')).slice(5, -2);
            }
        })
    },
    /*绘制评分的星星*/
    _renderStar: function(){
        var li_tpl = '<li class="star"></li>';
        var li_half_tpl = '<li class="star star-half"></li>';
        var li_grey_tpl = '<li class="star star-grey"></li>';
        $('.J_daytrip-item .item-stars').each(function(i, item){
            var li_html_tpl = '';
            var score = $(item).attr('data-score');
            if(score > 5 || score < 0) {
                score = 5;
            }
            var index = 0;
            var score_integer = parseInt(score);
            for(var i = 0; i < score_integer; i++) {
                li_html_tpl += li_tpl;
                index++;
            }
            if(score > score_integer) {
                //如果有小数，还要绘制半颗星星
                li_html_tpl += li_half_tpl;
                index++;
            }
            //补充灰色的星星
            for(var i = 0; i < 5 - index; i++) {
                li_html_tpl += li_grey_tpl;
            }
            $(item).html(li_html_tpl);
        });
    }
});


new daytrip();