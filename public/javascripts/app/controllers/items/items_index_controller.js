angular.module('app.controllers')

.controller('ItemsController', function($scope, appSession, API, $http, $timeout, appAuth) {

  $scope.session = appSession;


  $scope.alerts = {
    success: [],
    error: []
  }
  $scope.selectedWorker = ""
  $scope.isSelected = false

  var workerToIssue = {}
  var itemToIssue = {_id: "", index: 0}

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
        $scope.isSelected = true;
        workerToIssue = temp_workers[i];
      }
    }
  }

  $scope.newIssue = function(item_id, item_index){
    itemToIssue._id = item_id
    itemToIssue.index = item_index
    $('#modal-new-issue').modal('show');
  }

  $scope.createIssue = function(){
    $scope.alerts.success = []
    $scope.alerts.error = []

    $http.post(API + '/issues', {new_issue: {worker: workerToIssue, item: itemToIssue._id}})
    .then(function(response) {
      $scope.isSelected = false;
      $scope.alerts.success.push(response.data);
      $scope.selectedWorker = ""
      $scope.items[itemToIssue.index].issue = response.data.issue_id
    }, function(response){
      $scope.alerts.error.push(response.data);
    })
    .finally(function(){
      $timeout(function () {
        $('#items-alerts').modal('show');
      }, 500);
    });
  }

  var getItems = function () {
    $http.get(API + '/items')
    .then(function(response) {
      $scope.items = response.data;
    }, function(response){
      console.log(response);
    });
  };

  $scope.getStatus = function(item_status) {
    if (item_status == null) return 'Disponible'
    else return 'En Prestamo'
  }

  $scope.viewItem = function(item_index) {
    location.href = '#/items/' + $scope.items[item_index]._id
  }


  if ($scope.session.requireLogin()){
    if ($scope.hasAccess('st_index')) {
      getItems();
    }
    else {
      location.href = '#/403'
    }
  }
  else {
    location.href = '/login/'
  }

});
