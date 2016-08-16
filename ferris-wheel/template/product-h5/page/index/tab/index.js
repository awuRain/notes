var $ = require('zepto');
var Tracker = require('Tracker');

$(function(){
  $('.product-loading').hide();
  $('.product-' + '0').show();
  $(".tab-button").eq(0).addClass('select-tab');
});

$(".tab-button").on("tap", function(e){
  var dom = $(e.target);
  var type = dom.attr('data-type');
  var taplog = dom.attr('data-taplog');
  Tracker.tapLog(taplog);
  $('.product').hide();
  $('.product-' + type).show();
  $(".tab-button").removeClass('select-tab');
  dom.addClass('select-tab');
  if($('.header-' + type)[0]) {
    $('.header').hide();
    $('.header-' + type).show();
  }
});
