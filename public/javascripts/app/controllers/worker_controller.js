angular.module('app.controllers')

.controller('WorkerController', function($scope, appSession, API, $http, $timeout, appAuth, $routeParams) {

  $scope.session = appSession;

  var getWorker = function () {
    $http.get(API + '/worker/' + $routeParams.worker_id)
    .then(function(response) {
      $scope.worker = response.data;
    }, function(response){
      console.log(response);
    });
  };

  $scope.saveWorker = function () {
    $http.post(API + '/worker/update', {worker: $scope.worker})
    .then(function(response) {
      $scope.editable = false;
      console.log(response);
    }, function(response){
      console.log(response);
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
