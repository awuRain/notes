/*
 * h5使用的sdk文件
 */

    //var jsmod = require('ui/jsmod/jsmod');
    //var Dialog = jsmod.ui.Dialog;
    var Webapp = function() {
        this.init.apply(this, arguments);
    };

    var empty = function() {};

    Webapp.prototype = {
        // 版本号
        version: '0.0.1',

        //标记设备信息
        device: {},
        //客户端信息
        client: {},
        //是否展示头部
        hasHead: true,
        //是否使用了sdk
        sdk:0,
        //是否为客户端  终端类型 1.app,2.wap,3.pc
        client:2,
        //请求域名
        host: "",
        //门票域名
        mphost: "http://menpiao.baidu.com",
        // 桥初始化
        init: function() {
            this.getDeviceInfo();
        },
        host: "http://" + location.host,

        // 客户端生存环境下设置WebView顶部的标题显示文案
        // - 对于浏览器则直接更改页面的标题文案
        setTitle: function(title) {
            document.title = title;
        },

        //获取平台类型
        getPlatform: function() {
            var match = navigator.userAgent.match(/baidutravel[\s\/][\d\.]+/igm);
            if (match) {
                if (this.device.type) {
                    this.platform = this.device.type;
                }
                this.client.version = parseInt(match[0].match(/[\d\.]+/igm)[0].split('.').join(''), 10);
                this.client.versionStr = match[0].match(/[\d\.]+/igm)[0];
            }

            return this.platform;
        },
        getDeviceInfo: function() {
            var ua = navigator.userAgent;
            //设备类型
            if (/\(i[^;]+;( U;)? CPU.+Mac OS X/.test(ua)) {
                this.device.type = 'iphone';
            } else if (/Android/i.test(ua)) {
                this.device.type = 'android';
            } else {
                this.device.type = 'webapp';
            }

            return this.device;
        },
        //获取多个url参数
        getRequestParams: function(uri) {
            var search = location.search.substring(1);
            uri = uri || window.location.href;
            return search ? JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function(key, value) {
                return key === "" ? value : decodeURIComponent(value);
            }) : {};
        },
        enableDrapRefresh:function(opt){
            

        },
        //获取定位信息
        getLocationInfo: {
            default_cityid: "131",
            default_cityname: "北京",
            default_sid: "795ac511463263cf7ae3def3",
            default_sname: "北京",
            //cityid转为sid
            cityId: function() {
                return this.default_cityid;
            },
            cityName: function() {
                return this.default_cityname;
            },
          
            sid: function(callback) {
              // html5获取用户位置
                var options={
                       enableHighAccuracy:true, 
                       maximumAge:1000
                    },
                    me = this;

                if (navigator.geolocation) {
                    //浏览器支持geolocation
                    navigator.geolocation.getCurrentPosition(function(position){
                        //返回用户位置
                        //经度
                        var longitude = position.coords.longitude;
                        //纬度
                        var latitude = position.coords.latitude;
                        Bridge.Loader.get({
                            url: "/local/api?",
                            data: {
                                x: longitude,
                                y: latitude
                            },
                            success: function(data) {
                                if (data.errno == 0) {
                                    callback(data.data.location.sid);
                                } else if(data.errno == 2016){
                                    Bridge.Toast.show("没有此城市的景点，请选择其他城市。已为您切换到北京下的景点。");
                                    callback(me.default_sid);
                                }else {
                                    callback(me.default_sid);
                                }
                            },
                            error: function() {
                                callback(me.default_sid);
                            }
                        })

                    },function(error){
                        switch (error.code) {
                            case 1:
                                alert("位置服务被拒绝");
                                break;
                            case 2:
                                alert("暂时获取不到位置信息");
                                break;
                            case 3:
                                alert("获取信息超时");
                                break;
                            case 4:
                                alert("未知错误");
                                break;
                        }
                        callback(me.default_sid);
                        },options);

                } else {
                    //浏览器不支持geolocation
                    callback(this.default_sid);
                }
            },
            sname: function() {
                BNJS.http.get({
                    url: this.locationUrl,
                    params: {
                        city_id: BNJS.location.cityCode
                    },
                    onSuccess: function(data) {
                        if (!data.errno && data.data && data.data.scene && data.data.scene.sname) {
                            callback(data.data.scene.sname);
                        } else {
                            callback(this.default_sname);
                        }
                    },
                    onFail: function(data) {
                        callback(this.default_sname)
                    }
                });
            }
        },
        addActionButton: function(opt) {

        },
        onActionBack: function(cback) {

        },
        Loading: {
            hide: function() {

            },
            show: function() {

            }
        },

        //请求数据相关，在webview用NA作为代理，webapp走ajax异步请求
        Loader: {
            post: function(options) {
                options.type = 'post';
                options.dataType = options.dataType || 'json';
                options.timeout = options.timeout || 5000;
                $.ajax(options);
            },
            get: function(options) {
                options.type = 'get';
                options.dataType = options.dataType || 'json';
                options.timeout = options.timeout || 5000;
                $.ajax(options);
            }
        },
        Data: {
            getData: function(callback) {
                var parms = Bridge.getRequestParams();
                callback(parms);
            }
        },

        // 打开一个新的窗口webview，以栈的方式来管理窗口webview
        pushWindow: function(options, callback) {
            if (options["webUrl"]&&options.webUrl.indexOf("http://") != -1 && options.webUrl.indexOf("order_input")) {
                //对于跳转webapp支付，单独处理
                location.href = options.webUrl + "&" + $.param(options.params || {});
            } else {
                location.href = options.webUrl + "?" + $.param(options.params || {});
            }

        },
        Toast: {
            show: function(text) {
                alert(text)
                // new jsmod.ui.Toast(text);
            },
            alert: function(text, callback) {
              alert(text);
                callback && callback();
            },
            confirm:function(opt){
                var flag = confirm(opt.message);
                if(flag == true){
                    opt.onConfirm();
                }else{
                    opt.onCancel();
                }
                // BNJS.ui.dialog.show({
                //     title: '测试Dialog',
                //     message: '我是测试Dialog~~~~',
                //     ok: '确定',
                //     cancel: '取消',
                //     onConfirm: function() {
                //         BNJS.ui.toast.show('您刚刚点击了确定按钮');
                //     },
                //     onCancel: function() {
                //         BNJS.ui.toast.show('您刚刚点击了取消按钮');
                //     }
                // });
            },
            showLoading:function(){
                if(!this.dlg){
                    /*this.dlg = new Dialog({
                       html: '<div style="color:#fff;">' +
                               '正在提交订单，请稍后...' +
                           '</div>'
                    });*/
                }
               // this.dlg.show()
            },
            hideLoading:function(){
                //this.dlg.hide();
                // BNJS.ui.dialog.hideLoading() 
            }
        },
        Account: {
            isLogin: function() {
                var flag;
                Bridge.Loader.get({
                    url : '/user/ajax/getuser?format=ajax',
                    data: {t : new Date().getTime()},
                    async: false,
                    success:function(data){
                        if(data.errno === 0){
                            flag = true;
                        }else{
                            flag = false;
                        }
                    },
                    error:function(){
                        flag = false;
                    }
                })
                return flag;
            },
            toLogin: function(option) {
                //url  需要是内网沙盒地址 可以访问的 域名下
                var url = encodeURIComponent(option.url);
                location.href="http://wappass.baidu.com/passport/?login&u="+url;
            },
            getMobile: function(option) {
                return "13810007890"
            },
            getBduss: function() {
                var arr,reg=new RegExp("(^| )BDUSS=([^;]*)(;|$)");
                if(arr=document.cookie.match(reg)){
                    return unescape(arr[2]);
                }else{
                    return false;
                }
            }
        },
        Page:{
            goBack:function(){
                history.back();
            }
        },
        payOrder: function(data) {
            location.href= data["impay_url"];
        }


    };

    //extend
    function extend(oa, ob) {
        for (var k in ob) {
            if (ob.hasOwnProperty(k) && ob[k] !== undefined) {
                oa[k] = ob[k];
            }
        }
        return oa;
    }


    //唯一标志符生成器
    function buildRandom() {
        var random = new Date().getTime() + '_' + parseInt(Math.random() * 1000000);
        return random;
    }

    //获取绝对地址
    function getAbsoultePath(href) {
        var link = document.createElement('a');
        link.href = href;
        return (link.protocol + '//' + link.host + link.pathname + link.search + link.hash);
    }

    window.Bridge = new Webapp();
