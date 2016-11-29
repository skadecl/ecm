angular.module('app.controllers')

.controller('WorkerController', function($scope, appSession, API, $http, $timeout, appAuth, $routeParams) {

  $scope.session = appSession;
  $scope.alerts = {
    success: [],
    error: []
  }

  var getWorker = function () {
    $http.get(API + '/worker/' + $routeParams.worker_id)
    .then(function(response) {
      $scope.worker = response.data;
    }, function(response){
      console.log(response);
    });
  };

  $scope.confirmDelete = function () {
    $('#worker-delete-confirm').modal('show');
  }

  $scope.saveWorker = function () {
    $scope.alerts.success = []
    $scope.alerts.error = []

    $http.post(API + '/worker/update', {worker: $scope.worker})
    .then(function(response) {
      $scope.editable = false;
      $scope.alerts.success.push(response.data);
      $('#worker-alerts').modal('show');
    }, function(response){
      $scope.alerts.error.push(response.data);
      $('#worker-alerts').modal('show');
    });
  }


  if ($scope.session.requireLogin()){
    getWorker();
    $scope.editable = false;
  }
  else {
    location.href = '/login/'
  }

});
