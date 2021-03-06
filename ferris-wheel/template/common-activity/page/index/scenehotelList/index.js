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

function scenehotel() {
    this.init();
}

$.extend(scenehotel.prototype, {
    _setTpl: function() {
        var self = this;
        self.scenehotelTpl = '<h2 class="section-title">'+ scenehotelTitle +'</h2>'+
        '<ul>' +
        '{@each discountList as item, index}' +
            '<li class="discount-list J_scenehotel-item {@if index < 5}show{@else}hideitem{@/if}" data-productId="${item.id}" data-src="${item.src}">' +
                    '<a class="discount-list-item" href="javascript:;">' +
                    '<div class="item-banner" style="background-image:url(${item.pic})" data-original_pic="${item.original_pic}"></div>' +
                    '<div class="item-ctn">' +
                        '<div class="item-title">' +
                            '<p>${item.title}</p>' +
                            '{@if item.score}' +
                                '<ul class="item-stars" data-score="${item.score}">'+
                                '</ul>'+
                            '{@/if}' +
                        '</div>' +
                        '<div class="item-buy">' +
                            '<span class="price price-sale"><em>${item.price}</em></span>' +
                            '<span class="price price-market"><em>${item.ori_price}</em></span>' +
                            '<button>立即抢</button>' +
                        '</div>' +
                    '</div>' +
            '</a>' +
            '</li>' +
            '{@/each}' +
        '</ul>' +
        '{@if discountList.length > 5}<div class="more J_More_scenehotel less_scenehotel"><span class="text">查看更多</span><span class="more-arrow">▾</span></div>{@/if}';
    },
    init: function(){
        var self = this;
        self._bind();
    },

    _bind: function(){
        var self = this;
        $('body').on('sid-select', function(e, data){
            var sid = data.sid;
            $('.scenehotel').html('<div class="loading">数据加载中...</div>');
            self._setTpl();
            self.loadData(sid);
        });
        $('body').on('tap', '.J_scenehotel-item', function(e){ 

            var dom = $(e.currentTarget),
                productId = dom.attr('data-productId');

            Tracker.tapLog(scenehotelLog);

            Bridge.Data.getParamsData(function (res) {
                delete res.url;
                var _param = $.extend({
                    ext_from: window.eventId
                }, res);

                Bridge.pushWindow({
                    "nuomi": 'bainuo://component?compid=lvyou&comppage=sceneryhotel_detail',
                    "nuomi-webapp": Bridge.appendParam('http://lvyou.baidu.com/static/foreign/page/sceneryhotel/detail/detail.html?product_id=' + productId, _param),
                    "data": $.extend({"product_id": productId}, _param)
                });
            });
        });
        //点击查看更多
        $('body').on('tap', '.J_More_scenehotel', function(e){
            var dom = $(e.currentTarget);
            if(dom.hasClass('less_scenehotel')) {
                $('.scenehotel .hideitem').css('display','block');
                dom.removeClass('less_scenehotel');
                dom.find('span.text').html('收起');
                dom.find('span.more-arrow').addClass('rotate');
            }
            else {
                $('.scenehotel .hideitem').css('display','none');
                dom.addClass('less_scenehotel');
                dom.find('span.text').html('查看更多');
                dom.find('span.more-arrow').removeClass('rotate');
            }
        });


    },
    loadData: function(sid){
        var self = this;
        var url = scenehotelUrl + sid + "&type=scenehotel&is_jsonp=1";
        $.ajax({
            url: url,
            dataType: 'jsonp',
            success: function(res){
                if (res.errno == 0) {
                    var tpl = self.scenehotelTpl;
                    if(res.data.list.length == 0) {
                        $('.scenehotel').html('<h2 class="section-title">'+ scenehotelTitle +'</h2><div class="text">不好意思噢，当前城市没有特价资源，我们会火速争取！</div>');
                    }
                    else {
                        $('.scenehotel').html(juicer(tpl, {
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
        $('.J_scenehotel-item .item-banner').each(function(i, item){
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
        $('.J_scenehotel-item .item-stars').each(function(i, item){
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


new scenehotel();