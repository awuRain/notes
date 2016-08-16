var $ = require('zepto');
var Bridge = window.Bridge;
var Tracker = require('Tracker');



Tracker.init({
    module: 'index',
    page: window.eventId
});
Tracker.pvLog();
var tapLog = $('.list').attr('data-taplog');


var isiOS = !!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

//判断是百度地图客户端
function isBaiduMap(){
    return /baidumap/i.test(navigator.userAgent);
}

//在地图客户端里
if(isBaiduMap()) {
    if (isiOS) {
        $('.ticket-list a').each(function() {
            var $this = $(this),
                iosHref = $this.attr('ios-href');
            $this.attr('href', iosHref);
        });
    }
}
else {
    $('.ticket-list a').each(function() {
        var $this = $(this),
            webappHref = $this.attr('webapp-href');
        $this.attr('href', webappHref);
    });
}

$('.ticket-list a').on('tap', function(){
    Tracker.tapLog(tapLog);
});







