$scope.data = {};
$scope.data.common = {};
$scope.data.index = {};
$scope.data.index.header = {};

$scope.data.index.header = {
    "hasRule":0,
    "hasProvince":0,
    "rulesCss":"text-shadow:0 0 5px #251C1A;color:#fff;"
};

$scope.data.index.coupon = {};
$scope.data.index.coupon.couponList = [{
    "title": "满199可用",
    "price": "30",
    "pbid": "aa",
    "id": "1"
}, {
    "title": "满199可用",
    "price": "30",
    "pbid": "bb",
    "id": "2"
}, {
    "title": "满199可用",
    "price": "50",
    "pbid": "cc",
    "id": "3"
}, {
    "title": "满199可用",
    "price": "50",
    "pbid": "dd",
    "id": "4"
}];

$scope.data.index.bannerList = {};
$scope.data.index.bannerList.bannerList = [{
    "url":"",
    "img":""
}];

$scope.addJxItemRow = function(){
    $scope.data.index.bannerList.bannerList.push({
        "url":"",
        "img":""
    });
}

$scope.removeJxItemRow = function(index) {
    $scope.data.index.bannerList.bannerList.splice(index, 1);
}