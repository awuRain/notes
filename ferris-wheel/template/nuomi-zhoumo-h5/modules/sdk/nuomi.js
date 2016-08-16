/*
 * 糯米使用的sdk文件
 */

var Nuomi = function () {
    this.init.apply(this, arguments);
};

var empty = function(){}; 

Nuomi.prototype = {
    // 版本号
    version: '0.0.1',

    //标记设备信息
    device: {},
    //客户端信息
    client: {},
    //是否展示头部
    hasHead:false,
    //是否使用了sdk
    sdk:1,
    //是否为客户端  终端类型 1.app,2.wap,3.pc
    client:1,
    //请求域名
    host:"http://lvyou.baidu.com",
    //门票域名
    mphost:"http://menpiao.baidu.com",
    // 桥初始化
    init: function () {
        this.getDeviceInfo();
    },
    host: "http://" + location.host,

    // 客户端生存环境下设置WebView顶部的标题显示文案
    // - 对于浏览器则直接更改页面的标题文案
    setTitle: function (title) {
        BNJS.ui.title.setTitle(title);
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
            this.device.type = undefined;
        }

        return this.device;
    },
    //获取多个url参数
    getRequestParams: function (uri) {
        var search = location.search.substring(1);
        uri = uri || window.location.href;
        return search ? JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function (key, value) {
            return key === "" ? value : decodeURIComponent(value);
        }) : {};
    },
    enableDrapRefresh:function(opt){
        var obj = {
            pullDown: true,     // 是否要开启下拉刷新功能
            pullDownCallback: function () {
                opt.callback();
                BNJS.ui.closePullAction('pulldown')
            }
        }
        BNJS.ui.nativeInterfere(obj);

    },

    //获取定位信息
    getLocationInfo: {
        default_cityid: "131",
        default_cityname: "北京",
        default_sid: "795ac511463263cf7ae3def3",
        default_sname: "北京",
        //cityid转为sid
        locationUrl:"http://lvyou.baidu.com/business/ajax/ticket/getsidbynuomi",
        cityCode: function(){
            return BNJS.location.cityCode;
        },
        cityId: function(){
            return BNJS.location.cityCode ? BNJS.location.cityCode : this.default_cityid;
        },
        cityName: function(){
            return BNJS.location.cityName ? BNJS.location.cityName : this.default_cityname;
        },
       
        sid: function(callback){
            var me = this;
            Bridge.Loader.get({
                url : this.locationUrl,
                data: {city_code : BNJS.location.selectCityCode || BNJS.location.cityCode},
                success:function(data){
                    if(data.errno == 0){
                        callback(data.data.sid);
                    } else if(data.errno == 2016){
                        Bridge.Toast.show("没有此城市的景点，请选择其他城市。已为您切换到北京下的景点。");
                        callback(me.default_sid);
                    } else {
                        callback(me.default_sid);
                    }  
                },
                error:function(){

                }
            })
            // BNJS.http.get({
            //     url : this.locationUrl,
            //     params: {city_id : BNJS.location.cityCode},
            //     onSuccess : function(data) {
            //         if(!data.errno && data.data && data.data.scene && data.data.scene.sid){
            //             callback(data.data.scene.sid);
            //         } else {
            //             callback(this.default_sid);
            //         }  
            //     },
            //     onFail : function(data) {
            //         callback(this.default_sid); 
            //     }
            // });
        },
        sname: function(){
            BNJS.http.get({
                url : this.locationUrl,
                params: {city_id : BNJS.location.cityCode},
                onSuccess : function(data) {
                    if(!data.errno && data.data && data.data.scene && data.data.scene.sname){
                        callback(data.data.scene.sname);
                    } else {
                        callback(this.default_sname);
                    }
                },
                onFail : function(data) {
                    callback(this.default_sname)
                }
            });
        }
    },
    //在右侧的头部增加按钮
    addActionButton:function(opt){
        BNJS.ui.title.addActionButton(opt);
    },
    onActionBack:function(cback){
        BNJS.page.onBtnBackClick({
            callback: cback
        });
    },
    Loading:{
        hide:function(){
            BNJS.ui.hideLoadingPage();
        },
        show:function(){
            BNJS.ui.showLoadingPage();  
        }
    },

    //请求数据相关，在webview用NA作为代理，webapp走ajax异步请求
    Loader: {
        post: function(options){
            BNJS.http.post({
                url : options.url,
                params : options.data,
                onSuccess : options.success,
                onFail : options.error
            });
        },
        get: function(options){
            BNJS.http.get({
                url : options.url,
                params : options.data,
                onSuccess : options.success,
                onFail : options.error
            });
        }
    },
    Data:{
        getData:function(callback){
            BNJS.env.network(function(res){
                if(res.network == "non"){
                    BNJS.ui.showErrorPage();
                }else{
                    BNJS.page.getData(callback);
                }
                
            })
            
        }
    },

    // 打开一个新的窗口webview，以栈的方式来管理窗口webview
    pushWindow:function(options, callback){
        BNJS.page.start(options.schema,options.params||{})
    },
    Toast:{
        show:function(text){
            BNJS.ui.toast.show(text,1);
        },
        alert: function(text, callback){
            BNJS.ui.dialog.show({
                message: text,
                ok: '确定',
                onConfirm: function() {
                    callback && callback();
                }
            });
        },
        confirm:function(opt){
            BNJS.ui.dialog.show(opt);
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
            BNJS.ui.dialog.showLoading() 
        },
        hideLoading:function(){
            BNJS.ui.dialog.hideLoading() 
        }
    },
    Account:{
        isLogin:function(){
            return BNJS.account.isLogin ? BNJS.account.uid : false;
        },
        toLogin:function(option){
            var opt = {
                onSuccess:option.success,
                onFail:option.error
            }
            BNJS.account.login(opt);
        },
        getMobile:function(option){
            var opt = {
                // 手机号类型，1：pass手机号，2：糯米手机号，二者可能不同。默认为1，pass手机号
                type:option.type,
                onSuccess:option.success,
                onFail:option.error
            }
            BNJS.account.getMobile(opt);
        },
        getBduss:function(){
          return BNJS.account.bduss;
        }

    },
    Page:{
        goBack:function(){
            BNJS.page.back();
        }
    },
    payOrder:function(opt){
        var noneedOpt = {
            // 来源 (tuanapp_ios 团购ios app; tuanapp_android 团购android app)
            tn:"",
            //订单查看链接url
            url:"",
            //业务扩展字段 异步通知的时候会原样返回
            extData:"",
            //支付成功，返回的页面
            returnUrl:"",
            // 订单类型，0：一般订单，1：0元订单
            orderType:0,
            // 应用方订单生成时间，格式为当前计算机时间和GMT时间所差的秒，不是毫秒
            orderCreateTime:"",
            // 实际支付金额，以分为单位   10元
            payAmount:1000,
            // 原价，以分为单位
            originalAmount:2000,
            // 订单或商品标题，长度256
            title:"",
            // 用户手机号
            mobile:"",
            // 商品信息，二维JSON串：((商品ID,名称,单价,数量)+)((id=>’’,price=>’’,number=>’’,name=’’)) price是单价，单位为分；number是数量；id是商品id；name是商品名。
            itemInfo:"",
            // 默认值为0。0：非SDK支付 1：SDK支付 注意：只有当deviceType为1时此参数方才有效。
            sdk:0,
            // 支付成功，回调函数，回传orderId：订单ID
            onSuccess:function(){},
            // 支付失败，回调函数，回传错误号和错误msg，.errno、.errmsg
            onFail:function(){},
            // 取消支付，回调函数
            onCancel:function(){}
        }
        var needOpt = {
            // 业务系统ID 必选 1 团百 2代购 3电影 4百糯 171 测试
            customerId:"171",
            // 服务定义，固定值：Cashier
            service:"Cashier",
            // 订单号，商户须保证订单号在商户系统内部唯一。只能为大小写英文字母或数字，例如：wangpiao0014686157
            orderId:"",
            // 终端类型( 1.app 2.wap 3.pc) 固定值：1.app
            deviceType:1,
            // 主动通知商户支付结果的URL，仅支持http(s)的URL
            notifyUrl:"",
            // 百度pass帐号id
            passuid:this.Account.isLogin(),
            // 将请求参数按字母序升序排序后使用&符号连接，即生成待签名字符串，该串后面再拼接密钥串，使用signType摘要算法生成签名字符串
            sign:"",
            // 摘要算法 1：MD5 2：SHA-1 默认值 1 MD5
            signType:1
        };
        // this.Loader.post({
        //   url:"https://zhifu.baidu.com/proxy/req/newcashier",
        //   // url:"http://cp01-testing-wallet2014-04.cp01.baidu.com:8480/proxy/req/newcashier",
        //   data:opt,
        //   success:function(){
        //     alert(1)
        //   },
        //   error:function(){
        //     alert(2)
        //   }
        // })
        if(!this.Account.isLogin()){
            this.Account.toLogin({
                url:location.href,
                success:function(){
                    BNJS.page.startPay(opt);
                },
                error:function(){
                }
            })
        }else{
            BNJS.page.startPay(opt);
        }
        
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

window.Bridge = new Nuomi();



