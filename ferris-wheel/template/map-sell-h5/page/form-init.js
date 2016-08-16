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

$scope.data.index.ticketList2 = {};
$scope.data.index.ticketList2.list = [{
    "title":"",
    "list":[{
        "type":"pic",
        "buttons":[{}]
    }]
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

$scope.addItemRow2 = function(){
    $scope.data.index.ticketList2.list.push({
        "title":"",
        "list":[{
            "type":"pic",
            "buttons":[{
                "tid":"",
                "text":"到这里去"
            }]
        }]
    });
}

$scope.removeItemRow2 = function(index) {
    $scope.data.index.ticketList2.list.splice(index, 1);
}

$scope.addProductRow2 = function(list) {
    list.push({
        "type":"pic",
        "buttons":[{
            "tid":"",
            "text":"到这里去"
        }]
    });
}

$scope.removeProductRow2 = function(index, list){
    list.splice(index, 1);
}

$scope.addButton = function(list) {
    list.push({"tid":"",
        "text":"到这里去"});
}

$scope.removeButton = function(index, list) {
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
