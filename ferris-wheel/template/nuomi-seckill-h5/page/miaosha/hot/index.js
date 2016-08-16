var Bridge = window.Bridge;
var $ = require('zepto');
var juicer = require('juicer');
var tpl = '{@each list as value,i}' +
    '{@if value.tickets.tickets && value.tickets.tickets.length && value.tickets.tickets[0]}' +
    '<div class="tickets-item border-bottom" data-tid="${value.scene.td_id}" data-tfrom="${value.scene.td_from}">' +
    '<div class="pic">' +
    '<div class="img" style="background: transparent url(${value.scene.sight_images}) center center no-repeat;"></div>' +
    '</div>' +
    '<div class="cont">' +
    '<h4>${value.scene.td_name}</h4>' +
    '<div class="star-level">' +
    '<span style="width:${value.scene.score/5*100}%"></span>' +
    '</div>' +
    '<p><span class="money">￥</span><span class="price">${value.tickets.tickets[0].price}</span><span class="qi">起</span></p>' +
    '<i>${value.scene.star}</i>' +
    '</div>' +
    '</div>' +
    '{@/if}' +
    '{@/each}';

var Tracker = require('Tracker');

Tracker.init({
    module: 'miaosha',
    page: window.eventId
});
var s;
//加载本地热门景点
Bridge.getLocationInfo.sid(function(sid){
    s = sid ? sid:'795ac511463263cf7ae3def3';
    Bridge.Loader.get({
        url: "http://lvyou.baidu.com/business/ajax/ticket/getbycitycode",
        data: {
            rn: 5,
            pn: 0,
            promotion_scene_key : s,
            promotion_scene_type : 'lvyou',
            order_by : 'score',
            sort : 'desc',
            tag_id : 0
        },
        success: function(data) {
            if(!data.errno && data.data && data.data.list && data.data.list.length){
                $('.hot-list').html(juicer(tpl,{
                    list: data.data.list
                }));
            }
        },
        error: function(data) {

        }
    });
});
//绑定事件
$('.hot-list').on("tap", ".tickets-item", function(){
    var cacheParams = {};
    cacheParams.td_id = $(this).attr("data-tid");
    cacheParams.is_base = 0;
    cacheParams.pn = 1;
    cacheParams.ext_from = window.eventId;
    Bridge.pushWindow({
        webUrl:"http://lvyou.baidu.com/static/foreign/page/ticket/nuoindex/index.html",
        schema:"bainuo://component?compid=lvyou&comppage=index",
        params:cacheParams
    });
});


$('.J_More').on('tap', function(){
    Tracker.tapLog($(this).attr('data-lvpos'));
    //跳转到景点列表页
    Bridge.pushWindow({
        schema: "bainuo://component?compid=lvyou&comppage=scenerylist",
        params: {
            "tag_id": 0,
            "from": 'webapp',
            "sid": s,
            "ext_from": window.eventId
        }
    });

});







