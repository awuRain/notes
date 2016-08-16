var $ = require('zepto');
function Mask(opt){
	this.init(opt);
}
$.extend(Mask.prototype,{
	class_name:"lv_m_mask",
	tpl:'<div class="##"></div>',
	init:function(opt){
		$.extend(this,opt);
		this.dom = this.getHtml();
		this.render();
		this.bindEvent();
	},
	bindEvent:function(){
		this.dom.on('touchstart', function(e) {
			e.preventDefault();
        });
	},
	show:function(){
		this.dom.css("display","block");
	},
	hide:function(){
		this.dom.css("display","none");
	},
	getHtml:function(){
		return $(this.tpl.replace(/##/ig,this.class_name));
	},
	render:function(){
		$(document.body).append(this.dom);
	}
})
module.exports = Mask