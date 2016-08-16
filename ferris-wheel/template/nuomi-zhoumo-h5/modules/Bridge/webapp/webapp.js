var bridge =  {

    /**
     * 根据定位拿到当前省份的sid
     * @param callback
     */
    getProvinceSid: function(callback){
        var self = this;
        if(self.cityId) {
            self._sendProvinceSidPost(self.cityId, callback);
        }else {
            self.getCity(function(data){
                self._sendProvinceSidPost(data.cityId, callback);
            });
        }
    },

    /**
     * 发送获取sid请求
     */
    _sendProvinceSidPost: function(cityId, callback) {
        var self = this;

        if(cityId){
            $.ajax({
                url: self.host + "/business/ajax/dailysale/getsidbycityid?map_city_id=" + cityId,
                method: "get",
                dataType:'jsonp',
                success: function(res){
                    if(res.errno == 0) {
                        self.sid = res.data.sid;
                        callback && callback(self.sid);
                    }else {
                        callback && callback(null);
                    }
                },
                fail: function(){
                    callback && callback(null);
                }
            });
        }else {
            callback && callback(null);
        }
    },

    /**
     * 根据当前定位拿到地图的city信息
     */
    getCity: function(callback){
        $.ajax({
            'url': 'http://api.map.baidu.com/location/ip?ak=x78oVekBLBQQ6VIvPoX7eNDj&callback=?',
            'dataType':'jsonp',
            success: function(data){
                if (data && data.status === 0 && data.content && data.content.address_detail) {
                    var result = {
                        province: data.content.address_detail.province,
                        city: data.content.address_detail.city,
                        cityId: data.content.address_detail.city_code
                    }
                    callback && callback(result);
                }
                else {
                    callback && callback({
                        province: null,
                        city: null,
                        cityId: null
                    });
                }
            },
            fail: function(){
                callback && callback({
                    province: null,
                    city: null,
                    cityId: null
                });
            }
        });
    },

    /**
     * 空函数，没啥卵用
     */
    initShare: function(){}
};

module.exports = bridge;