/**
 * 微信容器内的相关jsbridge
 * @author yanbin01@baidu.com zoujing@baidu.com
 *
 */


var wx = require('/lib/jweixin.js');
var $ = require('zepto');

var bridge =  {

    _init: function(){},

    /**
     * 在微信容器中初始化分享功能
     * @param params
     */
    initShare: function(params){
        //监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareTimeline({
            title: params.title, // 分享标题
            link: params.url, // 分享链接
            imgUrl: params.imgUrl, // 分享图标
            success: function () {
                params.success && params.success();
            },
            cancel: function () {
                params.cancel && params.cancel();
            }
        });
        // 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareAppMessage({
            title: params.title, // 分享标题
            link: params.url, // 分享链接
            imgUrl: params.imgUrl, // 分享图标
            desc: params.content,// 分享描述
            success: function () {
                params.success && params.success();
            },
            cancel: function () {
                params.cancel && params.cancel();
            }
        });
    },

    /**
     * 调用分享组件
     * @param params: 参数对象，包括分享标题、内容、图片、链接等信息
     */
    share: function(params){

    },

    /**
     * 返回当前经纬度信息
     */
    getGeocoder: function(callback){
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                callback && callback({
                    "latitude": res.latitude,
                    "longitude": res.longitude,
                    "x": res.latitude,
                    "y": res.longitude
                });
            }
        });
    },

    /**
     * 根据当前定位拿到地图的city信息
     */
    getCity: function(callback){
        var self = this;
        var default_cityid = '131';
        self.getGeocoder(function(res) {
            $.ajax({
                url: "http://api.map.baidu.com/geocoder/v2/?output=json&pois=0&coordtype=wgs84ll&ak=LKGfkilMR3nNueNWUtxGf3yu",
                method: "get",
                dataType: "jsonp",
                data: {
                    location: res.latitude + ',' + res.longitude
                },
                success: function (data) {
                    var current_sid;
                    if(data.status == 0) {
                        current_sid = data.result.cityCode;
                    }
                    else {
                        current_sid = default_cityid;
                    }
                    callback && callback({
                        province: data.result.addressComponent.procince,
                        city: data.result.addressComponent.city,
                        cityId: current_sid
                    });
                }
            });
        });
    },

    /**
     * 根据定位信息返回当前省份的sid
     */
    getProvinceSid: function(callback) {
        var self = this;
        self.getGeocoder(function(res) {
            $.ajax({
                url: "http://api.map.baidu.com/geocoder/v2/?output=json&pois=0&coordtype=wgs84ll&ak=LKGfkilMR3nNueNWUtxGf3yu",
                method: "get",
                dataType: "jsonp",
                data: {
                    location: res.latitude + ',' + res.longitude
                },
                success: function (data) {
                    var current_sid;
                    if(data.status == 0) {
                        current_sid = data.result.cityCode;
                    }
                    else {
                        current_sid = null;
                    }
                    self._getSidByCityId(current_sid, callback);
                }
            });
        });
    },

    /**
     * 通过地图的city拿到旅游的sid
     * @param cityid
     * @private
     */
    _getSidByCityId: function(cityid, callback){
        var self = this;
        if(!cityid) {
            callback && callback(null);
            return;
        }
        $.ajax({
            url: self.host + "/business/ajax/dailysale/getsidbycityid?map_city_id=" + cityid,
            method: "get",
            dataType:'jsonp',
            success: function(res){
                if(res.errno == 0) {
                    self.sid = res.data.sid;
                    callback && callback(self.sid);
                }
                else {
                    callback && callback(null);
                }
            },
            fail: function(){
                callback && callback(null);
            }
        });
    }
};

module.exports = bridge;


