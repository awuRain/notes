var Bridge = window.Bridge;
var $ = require('zepto');
var Tracker = require('Tracker');

Tracker.init({
    module: 'miaosha',
    page: window.eventId
});


$('.banner').css('background-image', 'url(' + product.banner + ')');
$('.J_Title').html(product.protitle);
$('.sub-title').html(product.subtitle);
$('.rules').html(product.rules);
$('.info').html(product.info);

//直接购票
$('.J_Buy').on('tap', function() {
    //发送点击统计
    Tracker.tapLog(product.lvpos);
    var cacheParams = {};
    cacheParams.td_id = product.tid;
    cacheParams.order_ticketid = product.ticketId;
    cacheParams.partner_id = product.partnerID;
    cacheParams.scope_id = product.scenicID;
    cacheParams.is_base = 0;
    cacheParams.ext_from = window.eventId;

    Bridge.pushWindow({
        webUrl:"http://lvyou.baidu.com/static/foreign/page/ticket/detail/detail.html?pn=1",
        schema:"bainuo://component?compid=lvyou&comppage=detail",
        params:cacheParams
    });
});

if(window.BNJS) {
    BNJS.ui.title.removeBtnAll()
}
