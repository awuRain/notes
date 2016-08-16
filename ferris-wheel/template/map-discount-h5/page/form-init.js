$scope.data = {};
$scope.data.common = {};
$scope.data.index = {};
$scope.data.index.header = {};

$scope.data.index.ticketList = {};
$scope.data.index.ticketList.list = [{
    "title":"",
    "list":[ {
        "id":"",
        "banner":"",
        "subtitle":"",
        "title":"",
        "price":""}
    ]
}];

$scope.data.index.travelList = {};
$scope.data.index.travelList.list = [{
    "title":"",
    "list":[ {
        "id":"",
        "banner":"",
        "subtitle":"",
        "title":"",
        "price":""}
    ]
}];


$scope.addItemRow = function(){
    $scope.data.index.ticketList.list.push({
        "title":"",
        "list":[ {
            "id":"",
            "banner":"",
            "subtitle":"",
            "title":"",
            "price":""}
        ]
    });
}

$scope.removeItemRow = function(index) {
    $scope.data.index.ticketList.list.splice(index, 1);
}

$scope.addProductRow = function(list) {
    list.push({
        "id":"",
        "banner":"",
        "subtitle":"",
        "title":"",
        "price":""});
}

$scope.removeProductRow = function(index, list){
    list.splice(index, 1);
}


$scope.addTravelItemRow = function(){
    $scope.data.index.travelList.list.push({
        "title":"",
        "list":[ {
            "id":"",
            "banner":"",
            "subtitle":"",
            "title":"",
            "price":""}
        ]
    });
}

$scope.removeTravelItemRow = function(index) {
    $scope.data.index.travelList.list.splice(index, 1);
}

$scope.addTravelProductRow = function(list) {
    list.push({
        "id":"",
        "banner":"",
        "subtitle":"",
        "title":"",
        "price":""});
}

$scope.removeTravelProductRow = function(index, list){
    list.splice(index, 1);
}


$scope.data.index.guoneijingxuan = {};
$scope.data.index.guoneijingxuan.guoneijingxuan = [{
    "url":"",
    "img":""
}];

$scope.addJxItemRow = function(){
    $scope.data.index.guoneijingxuan.guoneijingxuan.push({
        "url":"",
        "img":""
    });
}

$scope.removeJxItemRow = function(index) {
    $scope.data.index.guoneijingxuan.guoneijingxuan.splice(index, 1);
}

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

$scope.data.index.link = {};
