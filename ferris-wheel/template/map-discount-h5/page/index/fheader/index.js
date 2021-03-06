var $ = require('zepto');
var discount = require('../discount/index.js');
var juicer = require('juicer');

function header() {
    this.init();
}



$.extend(header.prototype, {

    countryTpl: '{@each countryList as item}<li class="province-li" data-sid="${item.sid}" data-sname="${item.country_name}">${item.country_name}</li>{@/each}',

    //初始化函数，自动调用
    init: function(){
        var self = this;
        self._bind();
        new discount();
        self._renderCountryList();
        self.countrySid = sessionStorage.getItem("country-sid");
        if(self.countrySid) {
            $('body').trigger('citycode-ready', {"cityCode": self.countrySid});
        }
        else {
            //默认是香港
            self.countrySid = 1634;
            $('body').trigger('citycode-ready', {"cityCode": self.countrySid});
        }
    },

    //绑定事件相关
    _bind: function(){
        var self = this;
        $('.J_Selectcity').on('tap', function(){
            $('#J_province-flayer').show();
        });
        $('body').on('tap', '.J_province-close', function(){
            $('#J_province-flayer').hide();
        });
        $('body').on('tap', '.province-li', function(e){
            var dom = $(e.currentTarget);
            $('.province-li-active').removeClass("province-li-active");
            $(dom).addClass("province-li-active");
            var sid = $(dom).attr('data-sid');
            var name = $(dom).attr('data-sname');
            $('body').trigger('citycode-ready', {"cityCode": sid});
            sessionStorage.setItem("country-sid", sid);
            $('.J_Selectcity .c2').html(name);
            setTimeout(function(){
                $('#J_province-flayer').hide();
            }, 500);
        });
    },

    //渲染国家列表
    _renderCountryList: function(){
        var self = this;
        $.ajax({
            url: '/business/ajax/overseasale/getcountrylist',
            type: 'get',
            dataType:'json',
            success: function(res){
                if(res.errno == 0) {
                    $('.province-ul').html(juicer(self.countryTpl, {countryList: res.data.list}));
                    $('[data-sid="' + self.countrySid + '"]').addClass("province-li-active");
                    $('.J_Selectcity .c2').html($('[data-sid="' + self.countrySid + '"]').html());
                }
            }
        });
    }

});

new header();
