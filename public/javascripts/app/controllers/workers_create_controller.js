angular.module('app.controllers')

.controller('NewWorkerController', function($scope, appSession, API, $http, $timeout, appAuth) {

  $scope.session = appSession;

  $scope.logWorker = function(){
    console.log($scope.new_worker);
  }


  if ($scope.session.requireLogin()){

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
      $http.post(API + '/worker/new/', {new_worker: $scope.new_worker})
      .then(function(response) {
        console.log(response);
      }, function(response){
        console.log(response);
      });
    }
  };

});
