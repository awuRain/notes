var Mask = require('ui/mask/index');
var Juicer = require('juicer');
/**
 * @author  zhuwenxuan
 * @class Popup
 * @desc   移动端所用的简单弹层组件
 * @params {option}
 */
function Popup(opt){
	this.init(opt);
}
$.extend(Popup.prototype,{
	//扩展自己的类名
	class_name:"",
	//标题
	title:"度假产品",
	//是否有头部
	hasHead:true,
	//水平垂直居中显示
	resetPosition:true,
	//内容
	content:"",
	tpl:['<div class="lv_m_popup ${class_name}">',
		'{@if hasHead}',
		'<div class="header"><span>${title}</span><i class="close">&times;</i></div>',
		'{@/if}',
		'<div class="body">$${content}</div>',
		'</div>'].join(""),
	init:function(opt){
		$.extend(this,opt);
		this.dom = this._getHtml();
		this.mask = new Mask();
		this._render();
	},
	_bindEvent:function(){
		var me = this;
		this.dom.on("tap",".close",function(e){
			me.hide();
			e.preventDefault();
		})
		this.mask.dom.on("tap",function(){
			me.hide();
		})
		/*this.dom.on("touchmove",function(e){
		 e.preventDefault();
		 });*/
	},
	_resetPosition: function(){
		var pop_height = parseInt(this.dom.css('height'));
		var pop_width = parseInt(this.dom.css('width'));
		this.dom.css({'margin-left': -(pop_width/2),'margin-top':  -(pop_height)/2});
	},
	/**
	 * @method
	 * @desc  打开弹层
	 * @name  show
	 **/
	show:function(){
		this.mask.show();
		this.dom.show();
		if(this.resetPosition) {
			this._resetPosition();
		}
	},
	/**
	 * @method
	 * @desc  设置弹层的标题
	 * @name  setTitle
	 * @param   String   头内容可以是html
	 **/
	setTitle:function(txt){
		this.dom.find(".header span").html(txt);
	},
	/**
	 * @method
	 * @desc  设置弹层的内容
	 * @name  setContent
	 * @param   String   内容可以是html
	 **/
	setContent:function(txt){
		if(typeof txt == 'string') {
			this.dom.find(".body").html(txt);
		}
		else {
			this.dom.find(".body").html('');
			this.dom.find(".body").append(txt);
		}
	},
	/**
	 * @method
	 * @desc  隐藏弹层
	 * @name  hide
	 **/
	hide:function(){
		this.mask.hide();
		this.dom.hide();
	},
	_getHtml:function(){
		return $(Juicer(this.tpl,this));
	},
	_render:function(){
		$(document.body).append(this.dom);
		this._bindEvent();
		this.hide()
	},
	//todo:今后有必要的话补充此销毁方法
	_destroy:function(){

	}
})
module.exports = Popup