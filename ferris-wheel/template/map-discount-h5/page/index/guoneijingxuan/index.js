var $ = require('zepto');
var Tracker = require('Tracker');

//统计pv uv
Tracker.init({
    module: 'index',
    page: window.eventId
});


//判断是否是糯米端
function isNuomi(){
    return /Nuomi/i.test(navigator.userAgent);
}
if(isNuomi()) {
    $('.J_Guonei').on('tap', function(){
        var dom = $(this);
        var url = dom.attr('data-url');
        var log = dom.attr('data-taplog');
        Tracker.tapLog(log);
        if(url.indexOf('http') == 0) {
            //如果是线上页面
            BNJS.page.start('bainuo://component?url=' + url);
        }
        else if(url.indexOf('bainuo' == 0)) {
            BNJS.page.start(url);
        }
    });
}
else {
    $('.J_Guonei').on('tap', function(){
        var dom = $(this);
        var url = dom.attr('data-url');
        var log = dom.attr('data-taplog');
        Tracker.tapLog(log);
        if(url.indexOf('http') == 0) {
            location.href = url;
        }
        else  {

        }
    });
}
