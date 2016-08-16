/**
 * 旅游容器内的相关js bridge
 * @author yanbin01@baidu.com
 */
var bridge = {

    /**
     * 打开登录界面
     */
    toLogin: function(){
        window.location.href = "lv://Panel?type=login";
    }

};

module.exports = bridge;


