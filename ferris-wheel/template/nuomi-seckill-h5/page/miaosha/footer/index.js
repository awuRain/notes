var Bridge = window.Bridge;
var Popup = require('ui/popup/index');

var s;

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
    //跳转到景点列表页
    Bridge.pushWindow({
        webUrl:"http://lvyou.baidu.com/static/foreign/page/ticket/channel/channel.html",
        schema:"bainuo://component?compid=lvyou&comppage=scenerylist",
        params: {
            "tag_id": '0',
            "from":'girl',
            "sid": s,
            "ext_from":window.eventId
        }
    });
});


