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

$.extend(discount.prototype, {

    _setTpl: function() {
        var self = this;
        self.type = discountType=='poi' ? {'text' : '起', 'page' : 'poiDetail'} : {'text' : '抢购', 'page' : 'skuDetail'};
        self.discountTpl = '<ul>' +
            '{@each discountList as item, index}' +
            '<li class="discount-list J_discount-item {@if index < 5}show{@else}hideitem{@/if}" data-ticket-id="${item.ticket_id}" data-src="${item.src}" data-uid="${item.poi_uid}" data-pid="${item.pid}" data-qunar-id="${item.qunar_id}" data-ctrip-id="${item.ctrip_id}">' +
                    '<a class="discount-list-item" href="javascript:;">' +
                    '<div class="item-banner" style="background-image:url(${item.pic_url})" data-original_pic="${item.pic_url}"></div>' +
                    '<div class="item-ctn">' +
                        '<div class="item-title">' +
                            (discountType == 'poi'
                            ?
                                ('<p>${item.poi_name}</p>')
                            :
                                ('<p>${item.ticket_name}</p>')
                            )
                            +
                            '{@if item.score}' +
                                '<ul class="item-stars" data-score="${item.score}">'+
                                '</ul>'+
                            '{@/if}' +
                            // '{@if item.star}' +
                            //     '<ul class="item-tags">'+
                            //         '<li class="tag tag-bgcolor">${item.star}</li>'+
                            //     '</ul>'+
                            // '{@/if}' +
                        '</div>' +
                        '<div class="item-buy">' +
                            (discountType == 'poi'
                            ?
                                ('<button>¥${item.price_info.map.min_price}'+ self.type.text +'</button>' +
                                '<span>¥${item.price_info.map.max_price}元</span>')
                            :
                                ('<button>¥${item.price}'+ self.type.text +'</button>' +
                                '<span>¥${item.ori_price}元</span>'))
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
            var ticket_id = dom.attr('data-ticket-id');
            var src = dom.attr('data-src');
            var uid = dom.attr('data-uid');
            var pid = dom.attr('data-pid');
            var qunar_id = dom.attr('data-qunar-id');
            var td_id = qunar_id;
            var ctrip_id = dom.attr('data-ctrip-id');

            Tracker.tapLog(discountTapLog);

            var page = self.type.page;
            var _param = {
                ext_from: window.eventId
            };

            if (page == 'poiDetail') {
                var map_webapp_data = $.extend({
                    uid: uid,
                    qt: 'ninf',
                    industry: 'scope'
                }, _param);

                var nuomi_webapp_data = $.extend({
                    td_id: td_id
                }, _param);

                var nuomi_data = $.extend({
                    td_id: td_id
                }, _param);

                var map_data = $.extend({
                    uid: uid
                }, _param);
            } else {
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
            }

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
        // $.ajax({
        //     url: url,
        //     type:'get',
        //     dataType:'jsonp',
        //     success: function(res){
        //         if (res.errno == 0) {
        //             var tpl = self.discountTpl;
        //             if(res.data.list.length == 0) {
        //                 $('.discount').html('<div class="text">不好意思噢，当前城市没有特价资源，我们会火速争取！</div>');
        //             }
        //             else {
        //                 $('.discount').html(juicer(tpl, {
        //                     discountList: res.data.list
        //                 }));
        //                 self._renderStar();
        //                 self._fixImg();
        //             }
        //         }
        //     }
        // });
        if (discountType == 'poi') {

            var list = [{
                bid: "7511505621250163575",
                poi_uid: "e0b3bf6659d6cc6e88b98870",
                sid: "12937",
                qunar_id: "15",
                ctrip_id: "51249",
                province: "宁夏",
                city: "固原",
                poi_name: "火石寨国家地质公园",
                pic_url: "http://img1.qunarzz.com//travel/d3/1504/83/a054e3023c03e7.jpg",
                brief: "有堪称四绝的奇山，岩层，茂树，洞窟",
                score: "4.3",
                price_info: {
                    map: {
                        min_price: 26,
                        max_price: 142
                    },
                    nuomi: {
                        min_price: 30,
                        max_price: 142
                    }
                }
            },
            {
            bid: "1259257537576828927",
            poi_uid: "af1ae56bc7d3f10b4307c188",
            sid: "11879",
            qunar_id: "151",
            ctrip_id: "20403",
            province: "贵州",
            city: "贵阳",
            poi_name: "青岩古镇",
            pic_url: "http://hiphotos.baidu.com/lvpics/pic/item/ac6eddc451da81cbda2940695266d01608243143.jpg",
            brief: "贵州省著名的历史文化名镇，历史悠久，人文荟萃，文化氛围极为浓郁。",
            score: "3.9",
            price_info: {
                    map: {
                        min_price: 70,
                        max_price: 85
                    },
                    nuomi: {
                        min_price: 70,
                        max_price: 85
                    }
                }
            },
            {
            bid: "1262646713387560560",
            poi_uid: "42ccbddebf7a7baf85420e7d",
            sid: "2364",
            qunar_id: "219",
            ctrip_id: 0,
            province: "浙江",
            city: "杭州",
            poi_name: "杭州乐园",
            pic_url: "http://hiphotos.baidu.com/lvpics/pic/item/63d9f2d3572c11df7261c62f622762d0f703c20e.jpg",
            brief: "杭州乐园确实好玩特有趣，过山车还不错，但是设施比较旧，交通很方便。",
            score: "4.3",
            price_info: {
                    map: {
                        min_price: 120,
                        max_price: 470
                    },
                    nuomi: {
                        min_price: 120,
                        max_price: 470
                    }
                }
            }];
        } else {
            
            var list = [
                {
                    bid: "18008876899526246399",
                    poi_uid: "43b7e88987d25b6a58f6be0f",
                    sid: "15218",
                    qunar_id: "31851",
                    ctrip_id: "140809",
                    province: "河南",
                    city: "鹤壁",
                    pic_url: "http://hiphotos.baidu.com/lvpics/pic/item/63d0f703918fa0ec308ea736279759ee3d6ddb44.jpg",
                    src: "ctripticket",
                    price: "40",
                    ori_price: "90",
                    ticket_name: "【携程特权日】鹤壁大伾山景区成人票",
                    ticket_id: "189012984",
                    pid: "1601853"
                },
                {
                    bid: "4878296053110165202",
                    poi_uid: "fcf7b3e21bbf9cad843304ac",
                    sid: "940646",
                    qunar_id: "196959",
                    ctrip_id: 0,
                    province: "福建",
                    city: "厦门",
                    pic_url: "http://img1.qunarzz.com//sight/p0/1411/f4/78e803cca8a9a2b4bcb07ba584b06653.water.jpg",
                    src: "ctripticket",
                    price: "68",
                    ori_price: "119",
                    ticket_name: "【携程特权日】鼓浪屿贝壳梦幻世界亲子票（1大1小）（儿童1.2M-1.5M）",
                    ticket_id: "189015269",
                    pid: "3561611"
                },
                {
                    bid: "18010943938436792319",
                    poi_uid: "b3aa435d50d4900b147643a6",
                    sid: "11977",
                    qunar_id: "15294",
                    ctrip_id: 0,
                    province: "广东",
                    city: "韶关",
                    pic_url: "http://hiphotos.baidu.com/lvpics/pic/item/86d6277f9e2f0708e04f508fe824b899a801f2f3.jpg",
                    src: "ctripticket",
                    price: "220",
                    ori_price: "300",
                    ticket_name: "【携程特权日】韶关丹霞山门票+竹筏休闲游船票成人票",
                    ticket_id: "189015856",
                    pid: "1648494"
                }
            ];
        }
        var tpl = self.discountTpl;
        $('.discount').html(juicer(tpl, {
            discountList: list
        }));
        self._renderStar();
        self._fixImg();

    },
    _fixImg: function() {
        $('.J_discount-item .item-banner').each(function(i, item){
            var original_pic = $(item).attr('data-original_pic');
            if(original_pic) {
                var img = new Image();
                img.onerror = function() {
                    $(item).css('background-image', 'url(http://webmap3.map.bdimg.com/maps/services/thumbnails?width='+ 340 +'&height='+ 300 +'&quality=120&align=middle,middle&src=' + original_pic + ')');
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
