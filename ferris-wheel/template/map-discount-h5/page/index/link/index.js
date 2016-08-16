var $ = require('zepto');
var Tracker = require('Tracker');

//统计pv uv
Tracker.init({
    module: 'index',
    page: window.eventId
});

function link() {
    this.init();
}

$.extend(link.prototype, {
	init: function(){
		var self = this;
		self._bind();
	},
	_bind: function(){
		$('body').on('tap', '.link-btn', function(e){
	    	Tracker.tapLog(linkTaplog);
		});
	}
});

new link();
