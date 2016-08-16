var Bridge = window.Bridge;
var $ = require('zepto');
var Popup = require('ui/popup/index');
var token, imageUrl, bdsToken, has_joined;
var yzm;

var Tracker = require('Tracker');

Tracker.init({
    module: 'miaosha',
    page: window.eventId
});
Tracker.pvLog();


/*
if(!Bridge.Account.isLogin()) {
    Bridge.Account.toLogin({
        success: function(){
            location.reload();
        },
        error: function(){
            location.reload();
        }
    });
}
*/



//判断当前秒杀的状态
var product = window.product;

var result = {
    "1": "秒杀成功！",
    "2": "好可惜！来晚一步！回去好好练手下次再来！",
    "3": "秒杀超时",
    "4": "好可惜！来晚一步！回去好好练手下次再来！",
    "5": "好可惜！来晚一步！回去好好练手下次再来！",
    "6": "没有秒杀权限",
    "7": "好可惜！来晚一步！回去好好练手下次再来！",
    "8": "好可惜！来晚一步！回去好好练手下次再来！",
    "9": "好可惜！来晚一步！回去好好练手下次再来！",
    "10": "验证码输入错误！"
}

var secKillBegin = new Date(product.date + ' ' + product.begintime);
var secKillEnd = new Date(product.date + ' ' + product.endtime);
var status, timestand;
var now = new Date();
if(now.getTime() < secKillBegin.getTime()) {
    status = 0;
    //开始倒计时
    //$('.fix')[0].className = 'fix will';
    GetRTime();
}
else if(now.getTime() > secKillEnd.getTime()) {
    status = 2;
    $('.daojishi').html('秒杀已结束');
    //$('.fix')[0].className = 'fix over';
}
else if((now.getTime() <= secKillEnd.getTime()) && (now.getTime() >= secKillBegin.getTime())) {
    status = 1;
    $('.daojishi').html('正在秒杀');
    //$('.fix')[0].className = 'fix seckill';
}
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
                var t = secKillBegin.getTime() - NowTime.getTime();
                var t2 = secKillEnd.getTime() - NowTime.getTime();
                if(t2 < 0 || t2 == 0) {
                    status = 2;
                    $('.daojishi').html('秒杀已结束');
                    $('.fix')[0].className = 'fix over';
                    return;
                }
                if(t < 0 || t == 0) {
                    setTimeout(GetRTime, 1000);
                    status = 1;
                    $('.daojishi').html('秒杀已开始');
                    $('.fix')[0].className = 'fix seckill';
                }
                else {
                    setTimeout(GetRTime, 1000);
                    var d = Math.floor(t/1000/60/60/24);
                    t -= d*24*60*60*1000
                    var h = Math.floor(t/1000/60/60);
                    t -= h*60*60*1000;
                    var m = Math.floor(t/1000/60);
                    t -= m*60*1000;
                    var s = Math.floor(t/1000);

                    $('.day').html(zero(d));
                    $('.hour').html(zero(h));
                    $('.minutes').html(zero(m));
                    $('.second').html(zero(s));
                }
            }
        },
        error: function(data) {
            setTimeout(GetRTime, 1000);
        }
    });
}




//获取用户当前状态
Bridge.Loader.get({
    url: Bridge.host + "/mall/webapp/ajax/seckilldetail",
    data: {
        activity_id: window.product.activity_id,
        fr:"nuomi"
    },
    success: function(data) {
        if(data.errno == 0) {
            //拿到用户是否有资格参加秒杀
            var rights = data.data.has_activity_rights;
            //获取用户的bdstoken
            bdsToken = data.data.user.bdstoken;
            //用户是否已经参加过秒杀了
            has_joined = data.data.has_joined;
            if(has_joined) {
                $('.fix').addClass('done');
            }
            else {
                if(rights == 1) {//有权限
                    if(status == 0) {
                        $('.fix').addClass('will');
                    }
                    else if(status == 1) {
                        $('.fix').addClass('seckill');
                    }
                    else if(status == 2) {
                        $('.fix').addClass('over');
                    }
                }
                else { //木有权限
                    $('.fix').addClass('apply');
                }
            }

        }
    },
    error: function(data) {

    }
});

//获取资格
$('.apply').on('tap', function(){
/*
    if(!Bridge.Account.isLogin()) {
        Bridge.Account.toLogin({
            success: function(){
                location.reload();
            },
            error: function(){
                location.reload();
            }
        });
        return;
    }
*/
    Bridge.Loader.post({
        url: Bridge.host + "/mall/ajax/buyseckillrights",
        data: {
            activity_id: window.product.activity_id,
            from:0,
            bdstoken: bdsToken,
            fr:"nuomi"
        },
        success: function(data) {
            if(data.errno == 0) {
                if(data.data.result == 1) {
                    Bridge.Toast.alert('你已成功获取秒杀资格，请按时前来参加秒杀。');
                    if(status == 0) {
                        $('.fix')[0].className = 'fix will';
                    }
                    else if(status == 1) {
                        $('.fix')[0].className = 'fix seckill';
                    }
                    else if(status == 2) {
                        $('.fix')[0].className = 'fix over';
                    }
                }
                else {
                    Bridge.Toast.alert('获取报名资格失败');
                }
            }
            else {
                if(data.errno == 2) {
                    Bridge.Toast.alert('先登录才能获取秒杀资格哦！');
                }
                else {
                    Bridge.Toast.alert(data.msg);
                }

            }
        },
        error: function() {
            Bridge.Toast.alert('艾玛，网络出错了。');
        }
    });

});

//参加秒杀
$('.seckill').on('tap', function(){
    //参加秒杀之前必须获取token和验证码
    Bridge.Loader.get({
        url: Bridge.host + "/mall/ajax/getnewtoken",
        data: {
            activity_id: window.product.activity_id,
            bdstoken:bdsToken,
            fr:"nuomi"
        },
        success: function(data) {
            if(data.errno == 0) {
                token = data.data.data.token;
                imageUrl = data.data.data.imageurl;
                //弹窗出验证码
                var img_id = new Date().getTime();
                yzm = new Popup({
                    "content": "<section><img id='img_" + img_id + "' src='" + imageUrl + "' /></section>"
                });
                yzm.setTitle('依次点击图中文字');
                yzm.show();
                touchToken("#img_" + img_id);
            }
        },
        error: function(data) {

        }
    });
});

function createArrow(clientX, clientY) {
    var arrow = $('<div class="arrow" style="left:' + clientX + 'px;top:' + clientY + 'px;"></div>');
    $('body').append(arrow);
}

//输入验证码之后秒杀
function touchToken(id) {
    var tokenResult = [];
    var tokenLength = 0;
    $(id).on('click', function(){
        if(tokenLength < 3){
            tokenLength +=1;
            if(tokenLength > 0){
                //$('#J_token-tips').html('');
            }

            createArrow(event.clientX , event.clientY + $(window).scrollTop());

            //计算x偏移量
            var offsetX = event.clientX - $(this).offset().left;
            var offsetY = event.clientY - ($(this).offset().top - $(window).scrollTop());

            var rate = 330 / 180;
            offsetX = Math.floor(offsetX * rate);
            offsetY = Math.floor(offsetY * rate);

            tokenResult.push([offsetX, offsetY]);
            if(tokenLength == 3) {
                Bridge.Toast.showLoading();
                setTimeout(function(){
                    yzm.hide();
                    $('.arrow').remove();
                }, 500);
                //如果点了三次，自动发送请求
                Bridge.Loader.post({
                    url: Bridge.host + "/mall/ajax/seckillattend",
                    data: {
                        activity_id: window.product.activity_id,
                        from:1,
                        check_code: JSON.stringify(tokenResult),
                        vcode_str: token,
                        bdstoken: bdsToken,
                        fr:"nuomi"
                    },
                    success: function(data) {
                        Bridge.Toast.hideLoading();
                        if(data.errno == 0) {
                            if(data.data.result == 1) {
                                Bridge.Toast.alert('恭喜你，秒杀成功，点击购买3.7元门票！', function(){
                                    openOrderFill();
                                });
                            }
                            else {
                                Bridge.Toast.alert(result[data.data.result]);
                            }
                        }
                        else {
                            Bridge.Toast.alert('艾玛，出错了！');
                        }
                    },
                    error: function() {
                        Bridge.Toast.hideLoading();
                        Bridge.Toast.alert('艾玛，网络出错了。');
                    }
                });
            }
        }

    });
}

/*
var imageUrl = 'http://captcha.lvyou.baidu.com/captcha/getvimage?vcode=captchatouch567b1235a91f631e1cbcb3efa890de659t3lt77g3jf1xhx';
//弹窗出验证码
var img_id = new Date().getTime();
yzm = new Popup({
    "content": "<section><img id='img_" + img_id + "' src='" + imageUrl + "' /></section>"
});
yzm.setTitle('依次点击图中文字');
yzm.show();
touchToken("#img_" + img_id);
*/
function openOrderFill(){
    var urlParms = {};
    urlParms["ticket_id"] = product["ticketId"];
    urlParms["td_id"] = product["tid"];
    urlParms["partner_id"] = product["partnerID"];
    urlParms["scope_id"] = product["scenicID"];
    urlParms["ext_from"] = window.eventId;
    urlParms["order_from"] = 'nuomi';
    urlParms["td_from"] = product["partnerID"];
    urlParms["is_miaosha"] = 1;
    //urlParms["uid"] = self.scene_data.lv_scene_id||"";
    //urlParms["scope_name"] = self.scene_data.name||"";
    Bridge.pushWindow({
        webUrl:"http://lvyou.baidu.com/static/foreign/page/ticket/orderFill/orderFill.html?is_miaosha=1",
        schema:"bainuo://component?compid=lvyou&comppage=orderfill",
        params:urlParms
    });
}


