$scope.data = {};
$scope.data.common = {};
$scope.data.index = {};
$scope.data.index.header = {};
$scope.data.index.list = {};
$scope.data.index.list.list = [{
    "id":"",
    "banner":"",
    "protitle":"",
    "subtitle":"",
    "title":"",
    "date":"",
    "begintime":"",
    "endtime":""
}];

$scope.data.miaosha = {};
$scope.data.miaosha.detail = {};
$scope.data.miaosha.detail.productList = [{
    "id":"",
    "tid":"",
    "banner":"",
    "protitle":"",
    "subtitle":"",
    "title":"",
    "date":"",
    "begintime":"",
    "endtime":"",
    "activity_id":""
}];


$scope.data.miaosha.detail.productList = $scope.data.index.list.list;

$scope.addListRow = function(){
    $scope.data.index.list.list.push({
        "id":"",
        "tid":"",
        "banner":"",
        "protitle":"",
        "subtitle":"",
        "title":"",
        "date":"",
        "begintime":"",
        "endtime":""
    });
}
$scope.removeListRow = function(index){
    $scope.data.index.list.list.splice(index, 1);
}

$scope.addProductListRow = function(){
    $scope.data.miaosha.detail.productList.push({
        "id":"",
        "tid":"",
        "banner":"",
        "protitle":"",
        "subtitle":"",
        "title":"",
        "date":"",
        "begintime":"",
        "endtime":"",
        "activity_id":""
    });
}
$scope.removeProductListRow = function(index){
    $scope.data.miaosha.detail.productList.splice(index, 1);
}