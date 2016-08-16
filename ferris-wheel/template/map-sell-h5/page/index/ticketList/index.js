var $ = require('zepto');
var Tracker = require('Tracker');

//初始化Tracker组件
Tracker.init({
    module: 'index',
    page: window.eventId
});
//发送页面pv、uv请求
Tracker.pvLog();

var cityMap = {
    '北京市':'100010000',
    '上海市':'200010000',
    '重庆市':'900010000',
    '天津市':'500010000'
};

var citycode;
//通过map的接口拿到当前的codecode
nativeAppAdapter.getCity(function(data) {
    var cityid = data.id;
    var cityname = data.name;
    if(cityMap[cityname]) {
        citycode = cityMap[cityname];
        renderList();
    }
    else {
        $.ajax({
            url:'http://lvyou.baidu.com/business/ajax/ticket/Getpromotionscene?promotion_scene_type=map_scope&promotion_scene_key=' + cityid,
            type:'get',
            dataType:'jsonp',
            success:function(res){
                if(res.errno == 0) {
                    citycode = res.data.promotion_now.city_code;
                }
                renderList();
            }
        });
    }
});


function renderList() {
    var target = $('section.city' + citycode);
    if(target[0]) {
        if(citycode != $('.item-list section')[0].className) {
            target.insertBefore($('.item-list section').eq(0));
        }
    }
}

var isiOS = !!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
var isAndroid = window.navigator.userAgent.indexOf('Android') > -1 || window.navigator.userAgent.indexOf('Adr') > -1;

//判断是百度地图客户端
function isBaiduMap(){
    return /baidumap/i.test(navigator.userAgent);
}

var tapLog = $('.list').attr('data-taplog');

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





