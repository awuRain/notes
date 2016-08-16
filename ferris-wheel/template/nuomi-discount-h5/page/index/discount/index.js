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

function discount() {
    this.init();
}

var titleTpl = '';

$.extend(discount.prototype, {
    _setTpl: function() {
        var self = this;
        if (sectionTitle) {
            titleTpl = '<h2 class="section-title">'+sectionTitle+'</h2>'
        }
        self.type =  discountType == 'poi' ? {'text' : '起', 'page' : 'poiDetail'} : {'text' : '立即抢', 'page' : 'skuDetail'};
        self.discountTpl =  titleTpl +
        '<ul>' +
        '{@each discountList as item, index}' +
            '<li class="discount-list discount-list-' + discountType + ' J_discount-item {@if index < 5}show{@else}hideitem{@/if}" data-tdid="${item.td_id}" data-uid="${item.bid}" data-ticketid="${item.ticketId}" data-src="${item.src}">' +
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
                            (discountType == 'poi'
                            ?
                                ('<span class="price price-sale"><em>${item.market_price}</em></span>' +
                                '<button><span class="price"><em>${item.sale_price}</em></span>'+ self.type.text +'</button>')
                            :
                                ('<span class="price price-sale"><em>${item.sale_price}</em></span>' +
                                '<span class="price price-market"><em>${item.market_price}</em></span>' +
                                '<button>'+ self.type.text +'</button>'))
                            +
                        '</div>' +
                    '</div>' +
            '</a>' +
            '</li>' +
            '{@/each}' +
        '</ul>' +
        '{@if discountList.length > 5}<div class="more J_More less"><span class="text">查看更多</span><span class="more-arrow">▾</span></div>{@/if}';
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
            $('.discount').html('<div class="loading">数据加载中...</div>');
            self._setTpl();
            self.loadData(citycode);
        });
        $('body').on('tap', '.J_discount-item', function(e){

            var dom = $(e.currentTarget);
            var uid = dom.attr('data-uid');
            var td_id = dom.attr('data-tdid');
            var ticket_id = dom.attr('data-ticketid');

            Tracker.tapLog(discountTapLog);

            Bridge.Data.getData(function (res) {
                delete res.url;
                var _param = $.extend({
                    ext_from: window.eventId
                }, res);
                var data = $.extend({
                    td_id: td_id,
                    uid: uid,
                    bid: uid,
                    ticket_id: ticket_id,
                    map_ticket_id: ticket_id,
                }, _param);
                var page = self.type.page;
                Bridge.pushWindow({
                    'page' : page,
                    'data' : {
                        'nuomi' : data,
                        'map' : data,
                        'nuomi-webapp' : data,
                        'map-webapp' : data
                    }
                });
            })
        });
        //点击查看更多
        $('body').on('tap', '.J_More', function(e){
            var dom = $(e.currentTarget);
            if(dom.hasClass('less')) {
                $('.discount .hideitem').css('display','block');
                dom.removeClass('less');
                dom.find('span.text').html('收起');
                dom.find('span.more-arrow').addClass('rotate');
            }
            else {
                $('.discount .hideitem').css('display','none');
                dom.addClass('less');
                dom.find('span.text').html('查看更多');
                dom.find('span.more-arrow').removeClass('rotate');
            }
        });
    },
    loadData: function(citycode){
        var self = this;
        var url = window.host + (discountDataUrl ? discountDataUrl + citycode : 'business/ajax/dailysale/getsalelist?province_code='+ citycode);
        $.ajax({
            url: url,
            type:'get',
            dataType:'jsonp',
            success: function(res){
                if (res.errno == 0) {
                    var tpl = self.discountTpl;
                    if(res.data.list.length == 0) {
                        $('.discount').html(titleTpl+'<div class="text">不好意思噢，当前城市没有特价资源，我们会火速争取！</div>');
                    }
                    else {
                        $('.discount').html(juicer(tpl, {
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
        $('.J_discount-item .item-banner').each(function(i, item){
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
        $('.J_discount-item .item-stars').each(function(i, item){
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

module.exports = discount;