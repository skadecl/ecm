angular.module('app.controllers')

.controller('NewWorkerController', function($scope, appSession, API, $http, $timeout, appAuth) {

  $scope.session = appSession;
  $scope.alerts = {
    success: [],
    error: []
  }

  $scope.logWorker = function(){
    console.log($scope.new_worker);
  }

  var getFeedings = function () {
    $http.get(API + '/feeding')
    .then(function(response) {
      $scope.feedings = response.data;
    }, function(response){
      console.log(response);
    });
  };


  if ($scope.session.requireLogin()){

    getFeedings()

    $scope.new_worker = {}

    $scope.crearTrabajador = function () {
      createWorker()
    }
  }
  else {
    location.href = '/login/'
  }

  var createWorker = function(){
    if ($scope.new_worker){
      $scope.alerts.success = []
      $scope.alerts.error = []

      $http.post(API + '/workers', {new_worker: $scope.new_worker})
      .then(function(response) {
        $scope.alerts.success.push(response.data);
        $('#worker-alerts').modal('show');
        $scope.new_worker = {}
      }, function(response){
        $scope.alerts.error.push(response.data);
        $('#worker-alerts').modal('show');
      });
    }
  };

});
