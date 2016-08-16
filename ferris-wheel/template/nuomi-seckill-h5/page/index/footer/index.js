var Bridge = window.Bridge;
var Popup = require('ui/popup/index');
var Tracker = require('Tracker');

var s;
Tracker.init({
    module: 'index',
    page: window.eventId
});


Bridge.getLocationInfo.sid(function(sid){
    s = sid ? sid:'795ac511463263cf7ae3def3';
});
var p = new Popup({
    "content":$('#active-notice').html()
});
p.setTitle("活动说明");

$('.buttons .btn:first-of-type').on('tap', function(){
    p.show();
});

$('.buttons .btn:last-of-type').on('tap', function(){
    Tracker.tapLog($(this).attr('data-lvpos'));
    //跳转到景点列表页
    Bridge.pushWindow({
        webUrl:"/static/foreign/page/ticket/scenery_list/list.html?tag_id=0&from=girl&sid=" + s,
        schema:"bainuo://component?compid=lvyou&comppage=scenerylist",
        params: {
            "tag_id": 0,
            "from":'webapp',
            "sid": s,
            "ext_from": window.eventId
        }
    });



});


