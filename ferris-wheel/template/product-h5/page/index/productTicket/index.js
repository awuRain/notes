var $ = require('zepto');
var Bridge = require('Bridge');
var Tracker = require('Tracker');

$('.product-list').on('tap', '.product', function(e){
    var dom = $(e.currentTarget);
    var type = dom.attr('data-type');
    Tracker.tapLog($('div.tab-button-' + type).attr('data-productlog'));
    Bridge.pageTo('allView',{
        "id": dom.attr('data-sid')
    }, dom.attr('data-url'));
});
