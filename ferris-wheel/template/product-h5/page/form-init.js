$scope.data = {};
$scope.data.index = {};
$scope.data.index.header = {
    "banner":[{
      "url":""
    }]
};

$scope.data.index.tab = {};
$scope.data.index.tab.buttons = [{
  "text":""
}];

$scope.addHeaderRow = function(){
  $scope.data.index.header.banner.push({
    "url":""
  });
}
$scope.removeHeaderRow = function(index){
  $scope.data.index.header.banner.splice(index, 1);
}

$scope.addTabRow = function(){
  $scope.data.index.tab.buttons.push({
    "text":""
  });
}
$scope.removeTabRow = function(index){
  $scope.data.index.tab.buttons.splice(index, 1);
}

$scope.data.index.productTicket = {};
$scope.data.index.productTicket.productList = [{
    "img":"",
    "title":"",
    "tag":"",
    "detail":"",
    "old":"",
    "new":"",
    "context":"立即订票",
    "buttoncolor":"#ff9418",
    "type":"",
    "url":"",
    "tagcolor":"#67adee",
    "sid":"77bb6f54bc9175003aadecfe",
    "ptid":"c45891ca87274646403518f7"
}];

$scope.removeProductRow = function (index) {
    $scope.data.index.productTicket.productList.splice(index, 1);
}
$scope.addProductRow = function () {
    $scope.data.index.productTicket.productList.push({
        "img":"",
        "title":"",
        "tag":"",
        "detail":"",
        "old":"",
        "new":"",
        "context":"立即订票",
        "tagcolor":"#67adee",
        "buttoncolor":"#ff9418",
        "type":"",
        "url":"",
        "sid":"77bb6f54bc9175003aadecfe",
        "ptid":"c45891ca87274646403518f7"
    });
}

