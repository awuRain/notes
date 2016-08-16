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

$('.fixedTip a').on('tap', function(){
    var dom = $(this),
        url = dom.attr('data-url'),
        log = dom.attr('data-taplog');

    Tracker.tapLog(log);

    Bridge.Data.getParamsData(function (res) {
        delete res.url;
        var _param = $.extend({
            ext_from: window.eventId
        }, res);
        if (isNuomi()) {
            if(url.indexOf('http') == 0) {
                //如果是线上页面
                alert(Bridge.appendParam('bainuo://component?url=' + url, _param))
                BNJS.page.start(Bridge.appendParam('bainuo://component?url=' + url, _param));
            }
            else if(url.indexOf('bainuo' == 0)) {
                alert(Bridge.appendParam(url, _param))
                BNJS.page.start(Bridge.appendParam(url, _param));
            }
        } else {
            if(url.indexOf('http') == 0) {
                location.href = Bridge.appendParam(url, _param);
            }
            else  {

            }
        }
    });    
});
