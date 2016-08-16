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

function ticketList() {
    this.init();
}

var titleTpl = '';

$.extend(ticketList.prototype, {
    _setTpl: function() {
        var self = this;
        if (window.ticketListTitle) {
            titleTpl = '<h2 class="section-title">'+ticketListTitle+'</h2>'
        }
        self.discountTpl =  titleTpl +
        '<ul>' +
        '{@each ticketList as item, index}' +
            '<li class="discount-list discount-list-poi J_ticket-list-item {@if index < 5}show{@else}hideitem{@/if}" data-ticket-id="${item.ticket_id}" data-src="${item.src}" data-uid="${item.poi_uid}" data-pid="${item.pid}" data-qunar-id="${item.qunar_id}" data-ctrip-id="${item.ctrip_id}">' +
                    '<a class="discount-list-item" href="javascript:;">' +
                    '<div class="item-banner" data-original_pic="${item.pic_url}"></div>' +
                    '<div class="item-ctn">' +
                        '<div class="item-title">' +
                            '<p>${item.ticket_name}</p>' +
                            '{@if item.score||item.score==0}' +
                                '<ul class="item-stars" data-score="${item.score}">'+
                                '</ul>'+
                            '{@/if}' +
                        '</div>' +
                        '<div class="item-buy">' +
                            '<span class="price price-sale"><em>${item.price}</em></span>' +
                            '<span class="price price-market"><em>${item.ori_price}</em></span>' +
                            '<button>立即抢</button>'+
                        '</div>' +
                    '</div>' +
            '</a>' +
            '</li>' +
            '{@/each}' +
        '</ul>' +
        '{@if ticketList.length > 5}<div class="more J_ticket-list-More less"><span class="text">查看更多</span><span class="more-arrow">▾</span></div>{@/if}';
    },
    init: function(){
        var self = this;
        self._bind();
    },

    _bind: function(){
        var self = this;
        $('body').on('sid-select', function(e, data){
            
            var sid = data.sid;
            $('.ticketList').html('<div class="loading">数据加载中...</div>');
            self._setTpl();
            self.loadData(sid);
        });
        $('body').on('tap', '.J_ticket-list-item', function(e){
            var dom = $(e.currentTarget),
                ticket_id = dom.attr('data-ticket-id'),
                src = dom.attr('data-src'),
                uid = dom.attr('data-uid'),
                pid = dom.attr('data-pid'),
                qunar_id = dom.attr('data-qunar-id'),
                ctrip_id = dom.attr('data-ctrip-id');

            Tracker.tapLog(ticketListTapLog);

            Bridge.Data.getParamsData(function (res) {
                delete res.url;
                var _param = $.extend({
                    ext_from: window.eventId
                }, res);

                var map_webapp_data = $.extend({
                    pids: ticket_id,
                    ticket_id: ticket_id,
                    scope_id: src
                }, _param);

                var nuomi_webapp_data = $.extend({
                    pids: ticket_id,
                    ticket_id: ticket_id,
                    scope_id: src
                }, _param);

                var nuomi_data = $.extend({
                    pids: ticket_id,
                    ticket_id: ticket_id,
                    scope_id: src
                }, _param);

                var map_data = {
                    "skuDetail": $.extend({
                        param: '{"page":"ticketDetailPage","title":"门票详情","pids":"' + ticket_id + '","scope_id":"' + qunar_id + '","extra":[],"is_adult_ticket":0,"is_into_scope":0,"order_from":"mapmap","is_miaosha":"1", "bid": "'+ uid +'", "src": "'+ src +'"}', 
                    }, _param),
                    "orderFill": $.extend({
                        param: '{"partner_id":"' + src + '","scope_id":"' + ctrip_id + '","ticket_id":"' + pid + '","extra":[],"is_adult_ticket":0,"is_into_scope":0,"order_from":"map_scope", "bid": "'+ uid +'"}', 
                    },{
                        'mode': 'NORMAL_MODE',
                        'popRoot': 'no'
                    }, _param)
                };

                var page = 'skuDetail';

                Bridge.pushWindow({
                    'page' : page,
                    'data' : {
                        'nuomi' : nuomi_data,
                        'map' : map_data,
                        'nuomi-webapp' : nuomi_webapp_data,
                        'map-webapp' : map_webapp_data
                    }
                });
            });
        });
        //点击查看更多
        $('body').on('tap', '.J_ticket-list-More', function(e){
            var dom = $(e.currentTarget);
            if(dom.hasClass('less')) {
                $('.ticketList .hideitem').css('display','block');
                dom.removeClass('less');
                dom.find('span.text').html('收起');
                dom.find('span.more-arrow').addClass('rotate');
            }
            else {
                $('.ticketList .hideitem').css('display','none');
                dom.addClass('less');
                dom.find('span.text').html('查看更多');
                dom.find('span.more-arrow').removeClass('rotate');
            }
        });
    },
    loadData: function(sid){
        var self = this;
        // var url = window.host + (ticketListDataUrl ? ticketListDataUrl + citycode : 'business/ajax/dailysale/getsalelist?province_code='+ citycode);
        var url = 'http://gring.baidu.com/panama/api/getactivitybyid?activity_id='+ ticketListActivityId +'&sid='+ sid +'&is_jsonp=1';
        $.ajax({
            url: url,
            method: "get",
            dataType: 'jsonp',
            success: function(res){
                if (res.errNo == 0) {
                    var tpl = self.discountTpl,
                        list = res.data.list;
                    if(list.length == 0) {
                        $('.ticketList').html(titleTpl+'<div class="text">不好意思噢，当前城市没有特价资源，我们会火速争取！</div>');
                    }
                    else {
                        $('.ticketList').html(juicer(tpl, {
                            ticketList: list
                        }));
                        self._renderStar();
                        self._fixImg();
                    }
                }
            }
        });
    },
    _fixImg: function() {
        $('.J_ticket-list-item .item-banner').each(function(i, item){
            var original_pic = $(item).attr('data-original_pic');
            $(item).css('background-image', 'url(http://webmap3.map.bdimg.com/maps/services/thumbnails?width='+ 300 +'&height='+ 300 +'&quality=120&align=middle,middle&src=' + original_pic + ')');
        })
    },
    /*绘制评分的星星*/
    _renderStar: function(){
        var li_tpl = '<li class="star"></li>';
        var li_half_tpl = '<li class="star star-half"></li>';
        var li_grey_tpl = '<li class="star star-grey"></li>';
        $('.J_ticket-list-item .item-stars').each(function(i, item){
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

new ticketList();