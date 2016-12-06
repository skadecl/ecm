angular.module('app.controllers')

.controller('WorkerController', function($scope, appSession, API, $http, $timeout, appAuth, $routeParams) {

  $scope.session = appSession;
  $scope.alerts = {
    success: [],
    error: []
  }

  var getWorker = function () {
    $http.get(API + '/workers/' + $routeParams.worker_id)
    .then(function(response) {
      $scope.worker = response.data;
    }, function(response){
      console.log(response);
    });
  };

  $scope.viewHousing = function() {
    location.href = '#/housing/' + $scope.worker.housing._id
  }

  var getFeedings = function () {
    $http.get(API + '/feeding')
    .then(function(response) {
      $scope.feedings = response.data;
    }, function(response){
      console.log(response);
    });
  };

  $scope.idToDate = function(mongoId) {
    var timestamp = mongoId.toString().substring(0,8)
    var date =  new Date( parseInt( timestamp, 16 ) * 1000 )
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return day + '/' + month + '/' + year;
  }

  $scope.viewIssue = function(issue_id) {
    location.href = '#/issues/' + issue_id
  }

  $scope.saveWorker = function () {
    $scope.alerts.success = []
    $scope.alerts.error = []

    $http.patch(API + '/workers/' + $scope.worker._id, {worker: $scope.worker})
    .then(function(response) {
      $scope.editable = false;
      $scope.alerts.success.push(response.data);
    }, function(response){
      $scope.alerts.error.push(response.data);
    })
    .finally(function() {
      $('#worker-alerts').modal('show');
    });
  }

  $scope.deleteWorker = function () {
    $scope.alerts.success = []
    $scope.alerts.error = []

    $http.delete(API + '/workers/' + $scope.worker._id, {worker: $scope.worker})
    .then(function(response) {
      $scope.editable = false;
      $scope.alerts.success.push(response.data);
      $scope.worker = null;
    }, function(response){
      $scope.alerts.error.push(response.data);
    })
    .finally(function() {
      $('#worker-alerts').modal('show');
    });
  }


  if ($scope.session.requireLogin()){
    getFeedings()
    getWorker();
    $scope.editable = false;
  }
  else {
    location.href = '/login/'
  }

});
