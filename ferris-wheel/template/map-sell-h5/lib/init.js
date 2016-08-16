(function(window) {
    /**
     * 加载script
     * @param {Object} url
     * @param {Object} callback
     */
    function loadScript(url, callback) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = function() {
            callback();
        }
        document.head.appendChild(script);
    }
    /**
     * Ready
     * @param {Object} callback
     */
    if(/nuomi/i.test(navigator.userAgent)) {
        window.BNJSReady = function (readyCallback) {
            var callback = function(){
                if(readyCallback && typeof readyCallback == 'function') {
                    if (window.BNJS && typeof window.BNJS == 'object' && BNJS._isAllReady) {
                        readyCallback();
                    }
                    else {
                        document.addEventListener('BNJSReady', function() {
                            readyCallback();
                        }, false);
                    }
                }
            };
            if(window.loadBridge) {
                callback();
            }
            else {
                loadScript(__uri('/modules/sdk/nuomi.js'), callback);
                window.loadBridge = true;
            }
        };
    }
    else {
        window.BNJSReady = function (readyCallback) {
            var callback = function(){
                readyCallback = readyCallback || function(){};
                readyCallback();
            };
            if(window.loadBridge) {
                callback();
            }
            else {
                loadScript(__uri('/modules/sdk/webapp.js'), callback);
            }
        };
    }
})(window);