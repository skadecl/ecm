angular.module('app.controllers')

.controller('NewIssueController', function($scope, appSession, API, $http, $timeout, appAuth) {

  $scope.session = appSession;
  $scope.alerts = {
    success: [],
    error: []
  }

  $scope.selectedWorker = ""
  $scope.selectedItem = ""

  $scope.isReady = false

  $scope.stage1_ready = false;
  $scope.itemError = false;

  var workerToIssue = {}
  var itemToIssue = {}

  $scope.searchWorker = function(typedWorker){
    if (typedWorker && typedWorker.length > 2){
      $http.get(API + '/workers/search/' + typedWorker)
      .then(function(response) {
        $scope.newWorkers = response.data;
        $scope.newWorkersInfo = []

        for (var i = 0 ; i < $scope.newWorkers.length ; i++) {
          $scope.newWorkersInfo[i] = $scope.newWorkers[i].info
        }

      });
    }else {
      return
    }
  }

  $scope.selectWorker = function(selected){
    var temp_workers = $scope.newWorkers;

    for (var i = 0 ; i < temp_workers.length ; i++) {
      if (temp_workers[i].info == selected) {
        workerToIssue = temp_workers[i];
        $scope.isReady = true;
      }
    }
  }

  $scope.searchItem = function(typedItem){
    if (typedItem && typedItem.length > 2){
      $http.get(API + '/items/search/' + typedItem)
      .then(function(response) {
        $scope.newItems = response.data;
        $scope.newItemsInfo = []

        for (var i = 0 ; i < $scope.newItems.length ; i++) {
          $scope.newItemsInfo[i] = $scope.newItems[i].info
        }

      });
    }else {
      return
    }
  }

  $scope.selectItem = function(selected){
    var temp_items = $scope.newItems;

    for (var i = 0 ; i < temp_items.length ; i++) {
      if (temp_items[i].info == selected) {
        if (temp_items[i].issue == null) {
          itemToIssue = temp_items[i]
          $scope.itemError = false;
          $scope.stage1_ready = true
        }
        else {
          $scope.itemError = true;
        }
      }
    }
  }

  $scope.createIssue = function(){
    $scope.alerts.success = []
    $scope.alerts.error = []

    $http.post(API + '/issues', {new_issue: {worker: workerToIssue._id, item: itemToIssue._id}})
    .then(function(response) {
      $scope.alerts.success.push(response.data);
      $scope.isReady = false;
      $scope.stage1_ready = false;
      $scope.selectedWorker = ""
      $scope.selectedItem = ""
    }, function(response){
      $scope.alerts.error.push(response.data);
    })
    .finally(function(){
      $('#issues-alerts').modal('show');
    });
  }

  if ($scope.session.requireLogin()){
    if ($scope.hasAccess('is_add')) {
    $scope.new_item = {}
    }
    else {
      location.href = '#/403'
    }



  }
  else {
    location.href = '/login/'
  }

  $scope.createItem = function(){
    if ($scope.new_item){
      $scope.alerts.success = []
      $scope.alerts.error = []

      $http.post(API + '/items', {new_item: $scope.new_item})
      .then(function(response) {
        $scope.alerts.success.push(response.data);
        $('#items-alerts').modal('show');
        $scope.new_item = {}
      }, function(response){
        $scope.alerts.error.push(response.data);
        $('#items-alerts').modal('show');
      });
    }
  };

});
