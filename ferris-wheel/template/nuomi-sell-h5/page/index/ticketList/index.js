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
$('li.ticket-list').on('tap', function(){
    var tid = $(this).attr('data-tid');
    var cacheParams = {};
    cacheParams.td_id = tid;
    cacheParams.ext_from = window.eventId;
    cacheParams.is_base = 0;
    cacheParams.pn = 1;
    Tracker.tapLog(tapLog);
    Bridge.pushWindow({
        webUrl:"http://lvyou.baidu.com/static/foreign/page/ticket/nuoindex/index.html?ext_from=" + window.eventId,
        schema:"bainuo://component?compid=lvyou&comppage=index",
        params:cacheParams
    });
});







