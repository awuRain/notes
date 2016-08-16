define('ui/maskLayer/maskLayer', function(require, exports, module) {

var url = require('ui/url/url'),
    cssPrefix = $.fx.cssPrefix,
    transitionEnd = $.fx.transitionEnd;
var juicer = require('juicer');

/**
 * 默认配置
 */
var _option = {
    hasHeader: true,
    isChangeHistory: true,
    isScreenClickHide: false,
    enableAnimate: false
}

/**
 * 创建 mask layer
 * mask layer 可以加载自己的模板，完全将底层 dom 覆盖
 * @require maskLayer.less
 * @param {object} option 配置
 * @param {string} option.title              模板标题
 * @param {bool}   [option.hasHeader=true]   是否有 header
 * @param {int}    [option.isChangeHistory]  是否改变 history，如果不改变 history 调用hide时不调用 history.back 方法
 * @param {int}    [option.isScreenClickHide]点击黑色蒙层区域是否关弹窗
 * @param {int}    [option.height]           内容区域的高度，默认为100%
 */
var MaskLayer = function (option) {
    this.option = $.extend({}, _option, option);
    this.init();
}

var maskTpl = '<div class="mask-content">' + 
                '{@if content.hasHeader } ' +
                    '<div class="mask-actions -shadow-card common-widget-nav -shadow-card -bg-normal -vcenter" data-hide="true">' +
                        '<a class="cancel btn -flat back-btn">' +
                            '<i class="icon -back-arrow"></i>' +
                        '</a>' +
                        '<a href="javascript:void(0);" class="type title -ft-large">${content.title}</a>' +
                        '<a href="javascript:void(0);" class="submit" hover="2"></a>' +
                    '</div>' +
                '{@/if}' +
                '<div class="mask-detail">' +
                    '<div class="mask-loading">loading</div>' +
                '</div>' +
            '</div>'; 

$.extend(MaskLayer.prototype, {
    /**
     * 初始化 mask layer 
     */
    init: function () {
        var self = this,
            height = $(window).height(),
            mainContent = $(".orderfill-container");
        

        self.$maskScreen = $('<div class="mask-screen"></div>').appendTo(mainContent)
            .css("min-height", height);

        self.$maskContent = $(juicer(maskTpl,{content: self.option})).appendTo(self.$maskScreen);

        // 如果设置了高度就用高度做动画，否则将最小高度设置为屏幕高度
        if (self.option.height) {
            self.$maskContent.css("height", self.option.height);
        } else {
            self.$maskContent.css("min-height", height);
        }

        self.eventElement = self.$maskScreen;

        self.$maskDetail = self.$maskContent.find(".mask-detail");

        self.$maskContent.on("click", ".mask-actions .cancel", function () {
            self.hide();
        });
        

        if (self.option.isScreenClickHide) {
            self.$maskScreen.on("click", function (e) {
                if (e.target == self.$maskScreen.get(0)) {
                    self.hide();
                }
            });
        }



    },
    /**
     * 显示 mask
     * @param {function} cb 显示完成后的回调
     * @public
     */
    show: function (cb) {
        var self = this,
            height = $(window).height(),
            posY, e;

        // 生成显示前的事件，可以通过注册改变正常逻辑
        e = $.Event("beforshow");
        self.eventElement.trigger(e);
        if (e.isDefaultPrevented()) {
            return;
        }

        // 做一些重置的处理
        self.isShown = true;
        self.$maskScreen.show();
        self.showTimer && clearTimeout(self.showTimer);

        // 更新 url
        if (self.option.isChangeHistory) {
            url.update({
                pageState: {mask: 1}
            }, {
                trigger: false
            });
        }
        
        // 开启动画的情况
        if (self.option.enableAnimate) {
            // 重置某些状态 清空已有的显示逻辑
            self.$maskContent.off(transitionEnd);
            self.$maskContent.css(cssPrefix + 'transform', 'translateY(' + height + 'px)');
            
            self.showTimer = setTimeout(function () {
                self.$maskContent.one(transitionEnd, function () {
                    // 只有在没有设置高度时才把背景隐藏
                    if (!self.option.height) {
                        $("#pager").hide();
                        self.$maskScreen.css("position", "static");
                    } else {
                        // 这个地方的事件很关键，阻止了body的滚动
                        self.$maskScreen.on("touchmove.masklayer", function (e) {
                            e.preventDefault();
                        });
                    }
                    cb && cb(self.$maskDetail);
                });

                // 计算滚动到的位置
                posY = height - self.$maskContent.prop("clientHeight");
                self.$maskContent.css(cssPrefix + 'transform', 'translateY(' + posY + 'px)');
                self.$maskScreen.css("opacity", 1);
            }, 0);
        } else {
            self.$maskScreen.css("opacity", 1);

            if (!self.option.height) {
                $("#pager").hide();
                self.$maskScreen.css("position", "static");
            } else {
                // 计算滚动到的位置
                posY = height - self.$maskContent.prop("clientHeight");
                self.$maskContent.css("margin-top", posY + 'px');

                // 这个地方的事件很关键，阻止了body的滚动
                self.$maskScreen.on("touchmove.masklayer", function (e) {
                    e.preventDefault();
                });
            }

            cb && cb(self.$maskDetail);
        }
    },
    /**
     * 隐藏 mask
     */
    hide: function (cb) {
        var self = this,
            e;

        // 生成隐藏前的事件，可以通过注册改变正常逻辑
        e = $.Event("beforehide");
        self.eventElement.trigger(e);
        if (e.isDefaultPrevented()) {
            return;
        }

        // 在调用隐藏前将显示的逻辑去除
        self.showTimer && clearTimeout(self.showTimer);
        // 移除了 maskScreen 的事件
        self.$maskScreen.off("touchmove.maskLayer");
        self.isShown = false;
        
        // 改变了 history 在目前架构下必须回退，因为无法自定义 popstate，hashchange 方法
        if (self.option.isChangeHistory) {
            history.back();
            return;
        }

        // 重置状态, 不管是否height与否都重置一下
        $("#pager").show();
        self.$maskScreen.css("position", "fixed");

        if (self.option.enableAnimate) {
            self.$maskContent.off(transitionEnd);
            self.$maskContent.one(transitionEnd, function () {
                self.$maskScreen.hide();
                cb && cb(self.$maskDetail);
            });
            
            self.$maskContent.css(cssPrefix + 'transform', 'translateY(' + $(window).height() + 'px)');
            self.$maskScreen.css("opacity", 0);
        } else {
            self.$maskScreen.hide();
            self.$maskContent.css("margin-top", "0");
            cb && cb(self.$maskDetail);
        }
        
    },
    /**
     * 改变显示
     */
    switchDisplay: function () {
        this.isShown ? this.hide() : this.show();
    }
    
});

module.exports = MaskLayer;


});


function getUrlParams(){
    if(/(\&|\?)?source=app\b/.test(location.href)==true){
        return true;
    }else{
        return false;
    }
}
getUrlParams()&&$(".common-widget-nav").remove();