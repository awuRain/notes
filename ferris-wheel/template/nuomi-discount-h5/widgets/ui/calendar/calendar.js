/**
 * 日历模块
 * 此模块依赖 date.js webview 部分代码需要自行加入
 * @require "./date.js"
 */
var data = require("ui/calendar/date");

var Layer = jsmod.ui.Layer;

var CALENDAR_TPL = '<div class="hotel-calendar-header-content">' +
            '<i class="icon -close -large" style="color: #d6d6d6; padding: 10px; position: absolute; top: 0; right: 0;"></i>' + 
            '<span class="hotel-calendar-header"></span>' +
        '</div>' +
    '<div class="hotel-calendar-container"></div>';

var CALENDAR_STYLE_TEXT = '<style>' +
    '.hotel-calendar-header-content {' +
        'padding-bottom: 5px;' +
        'border-bottom: #d9d9d9;' +
        'background-color: #f5f6f7;' +
        'font-size: 14px;' +
        'text-align: center;' + 
        'line-height: 38px;' +
        'position: relative;' +
    '}' +
    '.hotel-calendar-header-date {' +
        'color: #ff6600' +
    '}' +
'</style>';

// 保存 calendar 的数据
var CALENDAR_LIST = {};

/**
 * 日历模块
 * @param {string} id             日历的 id 用于获得其引用
 * @param {object} option         配置项
 * @param {object} option.stObj   选择的开始日期
 * @param {object} option.stObj   选择的结束日期
 * @param {object} option.minDate 最小选择日期
 * @param {object} option.maxDate 最大选择日期
 */
var Calendar = function (id, option) {
    var self = this;

    self.option = option;
    self.eventElement = $("<div></div>");
    self.init();
    self.initEvent();

    CALENDAR_LIST[id] = self;
}

/**
 * 返回引用
 */
Calendar.getInstance = function (id) {
    return CALENDAR_LIST[id];
}

$.extend(Calendar.prototype, {
    /**
     * 添加事件逻辑
     */
    on: function () {
        var arg = Array.prototype.slice.call(arguments, 0);

        this.eventElement.on.apply(this.eventElement, arg);
    },
    /**
     * 添加事件逻辑
     */
    trigger: function () {
        var arg = Array.prototype.slice.call(arguments, 0);

        this.eventElement.trigger.apply(this.eventElement, arg);
    },
    init: function () {
        var self = this,
            option = self.option;

        // z-index 改为 1000 在 webapp 中能覆盖 header 部分
        self.layer = new Layer({
            height: "370px",
            maskIndex: 10000,
            contentBg: "#fff",
            otherElement: "#wrapper"
        });
        self.layer.$maskDetail.html(CALENDAR_TPL + CALENDAR_STYLE_TEXT);

        self.$header = self.layer.$maskDetail.find(".hotel-calendar-header");
        self.$calendar = self.layer.$maskDetail.find(".hotel-calendar-container");
        $(self.$calendar.get(0)).datepicker({
            isDoubleClick: false,
            price: option.price,
            date: option.stObj,
            minDate: option.minDate,
            maxDate: option.maxDate,
            valuecommit: function (e, stObj, stStr) {

                setTimeout(function () {
                    self.trigger("selected", [{
                        stObj: stObj,
                        stStr: stStr
                    }]);
                    self.layer.hide();
                }, 500);
                // 触发完成一次选择的事件
            },
            select: function (e, stObj) {
                // 开始日期的选择
                var stStr = $.datepicker.formatDate(stObj);

                self.trigger("stselected", [{
                    stObj: stObj,
                    stStr: stStr
                }]);
            },
            stclose: function () {
                // 如果点击了重选开始日期则改变 header 的文案
                self.$header.html("请选择使用日期");
            }
        });

        // 初始化完成后触发一次 selected, 增加 timeout 是因为为了让其他的模块也可以监听到此事件
        // setTimeout(function () {
        //     self.trigger("selected", [{
        //         stObj: option.stObj,
        //         stStr: $.datepicker.formatDate(option.stObj)
        //     }]);
        // }, 100);
    },
    initEvent: function () {
        var self = this;

        self.$header.html("请选择使用日期");

        // self.on("stselected", function (e, data) {
        //     self.$header.html('<span class="hotel-calendar-header-date">' + data.stStr + '</span>' + "入住，请选择离店时间");
        // });

        $(self.option.target.get(0)).on("click", function () {
            self.layer.show();
        });

        self.layer.$maskDetail.find(".hotel-calendar-header-content i").on("click", function () {
            self.layer.hide();
        });
    },
    hide: function () {
        this.layer.hide();
    },
    show: function () {
        this.layer.show();
    },
    destroy: function () {
        this.hide();
        this.layer.destroy();
    }
});

module.exports = Calendar;