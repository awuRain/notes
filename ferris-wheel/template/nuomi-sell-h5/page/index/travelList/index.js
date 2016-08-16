var $ = require('zepto');
var Bridge = window.Bridge;
var Tracker = require('Tracker');

var citycode;
if(window.BNJS) {
    citycode = BNJS.location.selectCityCode;
}

var target = $('section.city' + citycode);

if(target[0]) {
    if(citycode != $('.item-list section')[0].className) {
        target.insertBefore($('.item-list section').eq(0));
    }
}

Tracker.init({
    module: 'index',
    page: window.eventId
});
Tracker.pvLog();
var tapLog = $('.list').attr('data-taplog');


var isiOS = !!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

var click_type = isiOS?'tap':'click';

$('li.ticket-list').on(click_type, function(){
    var template_id = $(this).attr('data-templateId');
    Tracker.tapLog(tapLog);
    Bridge.pushWindow({
        webUrl: "http://lvyou.baidu.com/static/foreign/page/travel/detail/index.html?ext_from=" + window.eventId,
        schema: "bainuo://component?compid=lvyou&comppage=travel_detail",
        params: {
            "product_id": template_id,
            "ext_from":window.eventId
        }
    });
});







