var Bridge = function(){}

Bridge.prototype = {

    isBaiduTravel: function(){
        return /baidutravel/i.test(navigator.userAgent);
    },

    share: function(shareData_webview){
        window.shareIos = function() {
            return JSON.stringify(shareData_webview);
        }
        if (window.delegate) {
            delegate.setShareValue(shareData_webview.bigPicUrl, shareData_webview.thumbPicUrl, shareData_webview.title, shareData_webview.content, shareData_webview.webpageUrl, shareData_webview.type);
        }
        location.href = "lv://Panel?type=send_to_friend";
    },

    login: function(){
        window.location.href = "lv://Panel?type=login";
    },
    pageTo: function(type, obj, url){
        if(!this.isBaiduTravel()) {
            window.location.href = url;
        }
        else {
            location.href = "lv://Panel?type=" + type + (obj?('&json=' + encodeURIComponent(JSON.stringify(obj))):"");
        }
    }
};

module.exports = new Bridge();
