/**
 * common-bridge是H5组件和NA客户端之间通信的js sdk，支持糯米、地图、微信、手百等容器的环境，向业务代码提供统一的代码，工程师不必关注底层协议。在webapp环境中提供响应的降级处理
 * @author yanbin01@baidu.com zoujing@baidu.com
 * @date 2016-4-10
 */

var $ = require('zepto');
var utils = require('./utils/utils.js');
var map = require('./map/map-bridge.js');
var nuomi = require('./nuomi/nuomi-bridge.js');
var wechat = require('./wechat/wechat-bridge.js');
var lv = require('./lv/lv-bridge.js');
var webapp = require('./webapp/webapp.js');
var bdbox = require('./bdbox/bdbox-bridge.js');
var Notification = require('ui/notification/index');

function Bridge(){
    this.init();
}

$.extend(Bridge.prototype, {

    // 版本号
    version: '0.0.1',

    //标记设备信息,ios/android/other
    device: "",

    //标记客户端信息,map/nuomi/lvyou/wechat/webapp
    client: "",

    //所有异步接口可以取该前缀，调试的时候统一修改
    host: "http://lvyou.baidu.com/",

    /**
     * 页面路由，页面名称的配置参数
     */
    pageConfig: {
        "orderFill":{
            "nuomi":"http://lvyou.baidu.com/static/foreign/page/ticket/orderFill/orderFill.html?a=1",
            'map':'http://map.baidu.com/mobile/webapp/scope/orderFill/qt=order_input?a=1'
        },
        "poiDetail":{
            "map":"http://map.baidu.com/mobile/webapp/place/detail/foo=bar",
            'nuomi':'http://lvyou.baidu.com/static/foreign/page/ticket/nuoindex/index.html?a=1'
        },
        'poiList':{
            'nuomi':'http://lvyou.baidu.com/static/foreign/page/ticket/scenery_list/list.html?tag_id=0&from=webapp',
            'map':'http://map.baidu.com/mobile/webapp/search/search/foo=bar&qt=s&wd=%E6%99%AF%E7%82%B9'
        },
        'skuDetail':{
            'nuomi':'http://lvyou.baidu.com/static/foreign/page/ticket/discountDetail/detail.html?a=1',
            'map':'http://map.baidu.com/mobile/webapp/place/detail/foo=bar&qt=ninf&industry=scope'
        }
    },

    init: function(){
        this.urlParams = this.getRequestParams();
    },

    /**
     * webapp环境下页面跳转
     * @param params
     */
    pushWindow: function(params){

        var self = this;
        if(params.page) {
            self._pageGoTo(params);
        }
        else {
            if(location.host == 'map.baidu.com' || self.urlParams['na_from'] == 'map_scope') {
                location.href = params['map-webapp'];
            }
            else if(location.host == 'lvyou.baidu.com' || self.urlParams['na_from'] == 'nuomi')  {
                location.href = params['nuomi-webapp'];
            }
            else {
                location.href = params['nuomi-webapp'];
            }
        }
    },

    /**
     * 根据页面名称跳转
     * @private
     */
    _pageGoTo: function(params){
        var self = this;
        var url = '';
        if(location.host == 'lvyou.baidu.com' || self.urlParams['na_from'] == 'nuomi') {
            url = self.pageConfig[params.page]['nuomi'] + '&' + $.param(params.data['nuomi-webapp']);
        }
        else if(location.host == 'map.baidu.com'  || self.urlParams['na_from'] == 'map_scope')  {
            url = self.pageConfig[params.page]['map'] + '&' + $.param(params.data['map-webapp']);
        }
        else {
            url = self.pageConfig[params.page]['nuomi'] +  '&' + $.param(params.data['nuomi-webapp']);
        }
        location.href = url;
    },

    Loader: {
        /**
         * 对get异步请求的封装
         */
        get: function(data){
            data.type = 'get';
            data.dataType = data.dataType || 'json';
            $.ajax(data);
        },
        /**
         * 对post异步请求的封装
         */
        post: function(data){
            data.type = 'post';
            data.dataType = data.dataType || 'json';
            $.ajax(data);
        }
    },

    /**
     * 设置页面的title
     * @param title
     */
    setTitle: function(title){
        document.title = title;
    },

    /**
     * 判断用户是否登录
     */
    isLogin: function(callback){
        var self = this;
        if(location.host == 'lvyou.baidu.com') {
            $.ajax({
                url:"http://lvyou.baidu.com/user/ajax/getuser?t=" + (new Date()).getTime(),
                type:'get',
                dataType:'json',
                success:function(res){
                    if(res.errno == 0){
                        self.login = res.data.user.is_login;
                        callback && callback(self.login);
                    }
                    else {
                        callback && callback(0);
                    }
                }
            });
        }else {
            $.ajax({
                url:"http://map.baidu.com/opn/service/checkuser?t=" + (new Date()).getTime(),
                type:'get',
                dataType:'jsonp',
                success:function(res){
                    if(res.errno == 0){
                        self.login = res.result.uid ? 1 : 0;
                        callback && callback(self.login);
                    }
                    else {
                        callback && callback(0);
                    }
                }
            });
        }
    },

    /**
     * 返回当前经纬度信息
     */
    getGeocoder: function(callback){
        $.ajax({
            url: 'http://api.map.baidu.com/location/ip?ak=x78oVekBLBQQ6VIvPoX7eNDj',
            method: 'get',
            dataType: 'jsonp',
            success: function(res){
                callback && callback(res.content.point);
            },
            error: function(){

            }
        });
    },

    /**
     * 返回当前城市名称
     */
    getCityName: function(callback){
        $.ajax({
            url: 'http://api.map.baidu.com/location/ip?ak=x78oVekBLBQQ6VIvPoX7eNDj',
            method: 'get',
            dataType: 'jsonp',
            success: function(res){
                callback && callback(res.content.address_detail.city);
            },
            error: function(){
                callback && callback('北京市');
            }
        });
    },

    getProvinceSid: function(callback){
        var self = this;
        self.getCity(function(data){
            if(data.cityId){
                $.ajax({
                    url: self.host + "/business/ajax/dailysale/getsidbycityid?map_city_id=" + data.cityId,
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
            else {
                callback && callback(null);
            }
        });
    },

    /**
     * 根据当前定位拿到地图的city信息
     */
    getCity: function(callback){
        var self = this;
        $.ajax({
            'url': 'http://api.map.baidu.com/location/ip?ak=x78oVekBLBQQ6VIvPoX7eNDj&callback=?',
            'dataType':'jsonp',
            success: function(data){
                if (data && data.status === 0 && data.content && data.content.address_detail) {
                    var data = {
                        cityId : data.content.address_detail.city_code,
                        city : data.content.address_detail.city,
                        province : data.content.address_detail.province
                    };
                    self._getCityCodeByCityId(data, callback);
                }
                else {
                    callback && callback({
                        province: null,
                        city: null,
                        cityId: null
                    });
                }
            },
            fail: function(){
                callback && callback({
                    province: null,
                    city: null,
                    cityId: null
                });
            }
        });
    },

    /**
     * 根据cityId获取到对应的cityCode,合并getcity方法中的data传给回调函数
     */
    _getCityCodeByCityId: function(data, callback) {
        var self = this,
            citycode,
            cityid = data.cityId;
        $.ajax({
            url:'http://lvyou.baidu.com/business/ajax/ticket/Getpromotionscene?promotion_scene_type=map_scope&promotion_scene_key=' + cityid,
            type:'get',
            dataType:'jsonp',
            success: function(res){
                if(res.errno == 0) {
                    citycode = res.data.promotion_now.city_code;
                    var result = {
                        'province': data.province,
                        "city": data.city, 
                        "cityId": cityid,
                        "cityCode": citycode, 
                    };
                    callback && callback(result);
                }
            },
            fail: function() {
                callback && callback({
                    'province': data.province,
                    "city": data.city, 
                    "cityId": cityid,
                    "cityCode": null
                });
            }
        });
    },

    /**
     * 返回当前省份名称
     */
    getProviceName: function(){

    },

    /**
     * 跳转到登录页面进行登录
     */
    toLogin: function(){
        var self = this;
        var loginUrl, param, data;

        loginUrl = "http://wappass.baidu.com/passport/?", data = {};
        param = {};
        data.tpl = param.tpl || "ma";
        data.authsite = 1;
        data.u = location.href;

        loginUrl = self.appendParam(loginUrl, data);
        location.href = loginUrl;
    },

    Data: {
        getData: function(callback) {
            var parms = utils.getRequestParams();
            callback(parms);
        }
    },
    /**
     * toast弱提示
     */
    toast: function(title){
        Notification.simple(title);
    }
});

$.extend(Bridge.prototype, utils);
eval('$.extend(Bridge.prototype, ' + Bridge.prototype.client + ');');



module.exports = new Bridge();