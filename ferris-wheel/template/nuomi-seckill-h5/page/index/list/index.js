var $ = require('zepto');
var Bridge = window.Bridge;
var Tracker = require('Tracker');

Tracker.init({
    module: 'index',
    page: window.eventId
});
Tracker.pvLog();

var nowTime = new Date();

//找到每一天的抢购开始日期
$('.list li').each(function(index, item){
    var d = $(item).attr('data-date');
    var bt = $(item).attr('data-begintime');
    var et = $(item).attr('data-endtime');

    var secKillBeginTime = new Date(d + " " + bt);
    var secKillEndTime = new Date(d + " " + et);
    var dayBeginTime = new Date(d + " " + "00:00");

    if(nowTime.getTime() < dayBeginTime.getTime()) {//秒杀还没有开始
        $(item).addClass('seckill-future');
    }
    else if(nowTime.getTime() > dayBeginTime.getTime() && nowTime.getTime() < secKillBeginTime.getTime()) { //秒杀即将开始
        $(item).addClass('seckill-will');
    }
    else if(nowTime.getTime() >= secKillBeginTime.getTime() && nowTime <= secKillEndTime.getTime()) { //秒杀正在进行中
        $(item).addClass('seckill-ing');
    }
    else if(nowTime.getTime() > secKillBeginTime.getTime()) { //秒杀已经结束
        $(item).addClass('seckill-over');
    }
});

//找到所有还未开始的秒杀中，最近的那个活动
var nextSecKillTime = null;//下一次秒杀开始的时间
if($('.list li.seckill-ing')[0]) {
    $('.daojishi-ctn').html('秒杀正在进行');
}
else if($('.list li.seckill-will')[0]) {
    var nextLi = $('.list li.seckill-will').eq(0);
    nextSecKillTime = new Date(nextLi.attr('data-date') + " " + nextLi.attr('data-begintime'));
}
else if($('.list li.seckill-future')[0]) {
    var nextLi = $('.list li.seckill-future').eq(0);
    nextSecKillTime = new Date(nextLi.attr('data-date') + " " + nextLi.attr('data-begintime'));
}
else {
    $('.daojishi-ctn').html('秒杀已结束');
}



var timestand;
//初始化倒计时组件
if(!nextSecKillTime) {
    //$('.daojishi-ctn').remove();
}
else {
    GetRTime();
}

//绑定点击事件
$('.list li').on('tap', function(e){
    var target = $(e.currentTarget);
    if(!target.hasClass('seckill-over')) {

        Tracker.tapLog(target.attr('data-lvpos'));

        var url = location.href;
        url = url.replace('page/index/index.html', 'page/miaosha/index.html');
        Bridge.pushWindow({
                        schema: 'bainuo://component?url=' + url,
                                    params: {
                                                    product_id:target.attr('data-id')
                                                                }
                                                                        });
    }
});

function zero(i) {
    if(i < 10) {
        return '0' + i;
    }
    return i;
}

function GetRTime() {
    var NowTime;
    Bridge.Loader.get({
        url: Bridge.host + "/mall/ajax/gettime?t=" + new Date().getTime(),
        success: function(data) {
            if(data.errno == 0) {
                NowTime = new Date(data.data.time * 1000);
                var t = nextSecKillTime.getTime() - NowTime.getTime();
                if(t < 0 || t == 0) {
                    $('.seckill-will').addClass('seckill-ing').removeClass('seckill-will');
                }
                else {
                    var h = Math.floor(t/1000/60/60);
                    t -= h*60*60*1000;
                    var m = Math.floor(t/1000/60);
                    t -= m*60*1000;
                    var s = Math.floor(t/1000);
                    $('.time-block').eq(0).html(zero(h));
                    $('.time-block').eq(1).html(zero(m));
                    $('.time-block').eq(2).html(zero(s));
                    setTimeout(GetRTime, 1000);
                }
            }

        },
        error: function(data) {
            setTimeout(GetRTime, 1000);
        }
    });
}

if(window.BNJS) {
    BNJS.ui.title.removeBtnAll()
}
