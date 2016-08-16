$scope.data = {};
$scope.data.common = {};
$scope.data.index = {};
$scope.data.index.header = {};

$scope.data.index.ticketList = {};
$scope.data.index.ticketList.list = [{
    "title": "",
    "list": [{
        "id": "",
        "banner": "",
        "subtitle": "",
        "title": "",
        "price": ""
    }]
}];

$scope.data.index.travelList = {};
$scope.data.index.travelList.list = [{
    "title": "",
    "list": [{
        "id": "",
        "banner": "",
        "subtitle": "",
        "title": "",
        "price": ""
    }]
}];

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

$scope.data.index.takeplay = {};
$scope.data.index.takeplay.takelist = [{
    "title": "",
    "citycode": "",
    "list": [{
        "tapLog": "",
        "image": "",
        "title": "",
        "subtitle": "",
        "link": ""
    }]
}];

$scope.addProvinceItemRow = function() {
    $scope.data.index.takeplay.takelist.push({
        "title": "",
        "citycode": "",
        "list": [{
            "tapLog": "",
            "image": "",
            "title": "",
            "subtitle": "",
            "link": ""
        }]
    });
}

$scope.removeProvinceItemRow = function(index) {
    $scope.data.index.takeplay.takelist.splice(index, 1);
}

$scope.addCardRow = function(list) {
    list.push({
        "tapLog": "",
        "image": "",
        "title": "",
        "subtitle": "",
        "link": ""
    });
}

$scope.removeCardRow = function(index, list) {
    list.splice(index, 1);
}

$scope.addItemRow = function() {
    $scope.data.index.ticketList.list.push({
        "title": "",
        "list": [{
            "id": "",
            "banner": "",
            "subtitle": "",
            "title": "",
            "price": ""
        }]
    });
}

$scope.removeItemRow = function(index) {
    $scope.data.index.ticketList.list.splice(index, 1);
}

$scope.addProductRow = function(list) {
    list.push({
        "id": "",
        "banner": "",
        "subtitle": "",
        "title": "",
        "price": ""
    });
}

$scope.removeProductRow = function(index, list) {
    list.splice(index, 1);
}


$scope.addTravelItemRow = function() {
    $scope.data.index.travelList.list.push({
        "title": "",
        "list": [{
            "id": "",
            "banner": "",
            "subtitle": "",
            "title": "",
            "price": ""
        }]
    });
}

$scope.removeTravelItemRow = function(index) {
    $scope.data.index.travelList.list.splice(index, 1);
}

$scope.addTravelProductRow = function(list) {
    list.push({
        "id": "",
        "banner": "",
        "subtitle": "",
        "title": "",
        "price": ""
    });
}

$scope.removeTravelProductRow = function(index, list) {
    list.splice(index, 1);
}

$scope.addZhoumoItemRow = function() {
    $scope.data.index.takeplay.takelist.push({
        "tapLog": "",
        "image": "",
        "title": "",
        "subtitle": ""
    });
}

$scope.removeZhoumoItemRow = function(index) {
    console.log(index);
    $scope.data.index.takeplay.takelist.splice(index, 1);
}

$scope.downRow = function (index, list) {
    if(index == list.length -1) return;
    var item = list[index];
    list.splice(index, 1);
    list.splice(index + 1, 0, item);
}

$scope.upRow = function (index, list) {
    if(index == 0) return;
    var item = list[index];
    list.splice(index, 1);
    list.splice(index - 1, 0, item);
}