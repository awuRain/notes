var $ = require('zepto');
var juicer = require('juicer');
var Bridge = require('Bridge');
var Tracker = require('Tracker');
var lite = require('ui/lite/lite');

var box_w = 0, box_h = 0;

function hotrecommend() {
    this.init();
}

$.extend(hotrecommend.prototype, {

    hotTpl: '<h2 class="section-title">热门推荐</h2>'+
            '<ul>'+
        '{@each hotList as item}'+
        '<li class="hot-list J_Hotlist" data-tdid="${item.td_id}" data-uid="${item.uid}" data-ticketid="${item.ticketId}"><a href="javascript:;">'+
        '<div class="item-banner" data-src="${item.sight_images[0]}"></div>'+
        '<div class="item-ctn">'+
        '<div class="item-ctn-left">'+
        '<div class="item-placename">'+
        '${item.td_name}'+
        '</div>'+
        '<ul class="item-stars" data-score="${item.score}">'+
        '</ul>'+
        '<ul class="item-tags">'+
        '<li class="tag tag-bgcolor">${item.star}</li>'+
        '</ul>'+
        '</div>'+
        '<div class="item-ctn-right">'+
        '<div class="item-icon">票</div>'+
        '<div class="item-price"><span class="red">¥${item.price}</span>起</div>'+
            '<div class="item-distance">销量${item.salesNum}</div>'+
            '</div>'+
            '</div>'+
            '</a></li>'+
            '{@/each}'+
        '</ul>',
    init: function(){
        var self = this;
        self._bind();
    },

    _bind: function(){
        var self = this;
        $('body').on('sid-ready', function(e, data){
            var sid = data.sid;
            $('.hotrecommend').html('');
            self.loadData(sid);
        });
        $('body').on('tap', '.J_Hotlist', function(e){
            var dom = $(e.currentTarget);
            var uid = dom.attr('data-uid');
            var td_id = dom.attr('data-tdid');
            var ticket_id = dom.attr('data-ticketid');

            Tracker.tapLog(hotTapLog);

            Bridge.Data.getData(function (res) {
                delete res.url;
                var _param = $.extend({
                    ext_from: window.eventId
                }, res);
                var data = $.extend({
                    td_id: td_id,
                    uid : uid,
                    ticket_id : ticket_id
                }, _param);
                Bridge.pushWindow({
                    'page' : 'poiDetail',
                    'data' : {
                        'nuomi' : data,
                        'map' : data,
                        'nuomi-webapp' : data,
                        'map-webapp' : data
                    }
                });
            });
        });
    },
    loadData: function(sid){
        var self = this;
        $.ajax({
            url: window.host + 'business/ajax/search?rn=10&pn=1&sid=' + sid + '&category=qunar-jingdian',
            type:'get',
            dataType:'jsonp',
            success:function(res){
                if(res.errno == 0) {
                    var tpl = self.hotTpl;
                    $('.hotrecommend').html(juicer(tpl,{
                        hotList:res.data.scenes.list
                    }));
                    self._renderStar();
                    self.lazyLoadImg('.hotrecommend');
                }
            }
        })
    },
    lazyLoadImg: function(wrap) {

        var me = this;
        $(wrap).find('.item-banner').each(function(index, item) {
            var url = $(item).attr("data-src");
            var tempPic = new Image();
            box_w = box_w == 0 ? $(item).width() : box_w;
            box_h = box_h == 0 ? $(item).height() : box_h;
            var item_w = $(item).width()==0 ? box_w : $(item).width(),
                item_h = $(item).height()==0 ? box_h : $(item).height()
            tempPic.onload = function() {
                var tempObj = {
                    width: tempPic.width,
                    height: tempPic.height
                };
                item.innerHTML = lite.createImage(false, url, tempObj.width, tempObj.height, item_w, item_h, false, true);
            };
            // var url = 'http://webmap3.map.bdimg.com/maps/services/thumbnails?width='+ item_w +'&height='+ item_h +'&quality=100&align=middle,middle&src=' + url;
            tempPic.src = url;
        });
    },
    /*绘制评分的星星*/
    _renderStar: function(){
        var li_tpl = '<li class="star"></li>';
        var li_half_tpl = '<li class="star star-half"></li>';
        var li_grey_tpl = '<li class="star star-grey"></li>';
        $('.J_Hotlist .item-stars').each(function(i, item){
            var li_html_tpl = '';
            var score = $(item).attr('data-score');
            if(score > 5 || score < 0) {
                score = 5;
            }
            var index = 0;
            var score_integer = parseInt(score);
            for(var i = 0; i < score_integer; i++) {
                li_html_tpl += li_tpl;
                index++;
            }
            if(score > score_integer) {
                //如果有小数，还要绘制半颗星星
                li_html_tpl += li_half_tpl;
                index++;
            }
            //补充灰色的星星
            for(var i = 0; i < 5 - index; i++) {
                li_html_tpl += li_grey_tpl;
            }
            $(item).html(li_html_tpl);
        });
    }

});


new hotrecommend();
