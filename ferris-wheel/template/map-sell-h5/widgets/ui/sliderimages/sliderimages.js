/**
 * @file         图片滑动页
 * @author       huangjinjin<huangjinjin@baidu.com>
 * @description
 */

var juicer = require('juicer');

var Swiper = require('ui/swiper/swiper');
var $ = require('zepto');

var sliderImagesTpl = '' +
	'<div class="swiper-wrapper">' +
		'{@each list as it,index}' +
		'<div class="swiper-slide">' +
			'<figure class="image-items">' +
				'<img src="${it.src}" width="100%" class="swiper-lazy" alt="${it.name}">' +
				'<p>${it.desc}</p>' +
			'</figure>' +
		'</div>' +
		'{@/each}' +
	'</div>' +
	'<div class="swiper-pagination-info">1/${list.length}</div>';
	
	
function SliderImages(opt) {
	this.init.apply(this, arguments);
	$.extend(this,opt);
}

SliderImages.prototype = {
	
	init: function(list) {
		if (list && list.length) {
			this.list = list;
			this.total = list.length;
			this.render();
		}
	},
	
	
	render: function() {
		var me = this;
		//插入html
		this.el = $('<div class="swiper-container"></div>');
		this.el.append(juicer(sliderImagesTpl, {
            list: me.list
        }));
		$(document.body).append(this.el);

	},
	
	show: function() {
		var me = this;
		this.el.show();
		//已存在
		if (this.swiper) {
			this.swiper.slideTo(0);
		} else {
			//创建滑动
			this.swiper = new Swiper (me.el.get(0), {
	
				direction: 'horizontal',
				
				onSlideChangeEnd: function(swiper, event) {
					me.el.find('.swiper-pagination-info').text((1+swiper.activeIndex) + '/' + me.total);
				},
				
				onTap: function(swiper, event) {
					// if ($(event.srcElement).hasClass('swiper-container')) {

						me.hide();
						
					// }
				}
		
			})
		}
	},
	
	hide: function() {
		this.el && this.el.hide();
		//增加了隐藏回调 为了处理点透的问题
		this.hidecallback&&this.hidecallback();
	}
	
}

module.exports = SliderImages;
