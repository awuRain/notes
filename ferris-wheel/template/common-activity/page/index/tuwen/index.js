var $ = require('zepto');
var Bridge = require('Bridge');
var Tracker = require('Tracker');



Tracker.init({
    module: 'index',
    page: window.eventId
});
Tracker.pvLog();
var tapLog = $('.list').attr('data-taplog');
$('.J_item_btn').on('tap', function() {
    var tid = $(this).attr('data-tid');
    var schema = $(this).attr('data-schema');
    var cacheParams = {};
    cacheParams.td_id = tid;
    cacheParams.ext_from = window.eventId;
    cacheParams.is_base = 0;
    cacheParams.pn = 1;
    Tracker.tapLog(tapLog);
    if (tid) {
        Bridge.pushWindow({
            webUrl: "http://lvyou.baidu.com/static/foreign/page/ticket/nuoindex/index.html?ext_from=" + window.eventId,
            schema: "bainuo://component?compid=lvyou&comppage=index",
            params: cacheParams
        });
    }
    else if (schema) {
        var schemaArr = schema.split('|');
        Bridge.pushWindow({
            webUrl: schemaArr[1],
            schema: schemaArr[0],
            params: {}
        });
    }
});







