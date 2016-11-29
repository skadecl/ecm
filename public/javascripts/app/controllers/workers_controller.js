angular.module('app.controllers')

.controller('WorkersController', function($scope, appSession, API, $http, $timeout, appAuth) {

  $scope.session = appSession;

  var getWorkers = function () {
    $http.get(API + '/workers')
    .then(function(response) {
      $scope.workers = response.data;
      console.log($scope.workers);
    }, function(response){
      console.log(response);
    });
  };

  $scope.viewWorker = function(worker_index) {
    location.href = '#/worker/' + $scope.workers[worker_index]._id
  }


  if ($scope.session.requireLogin()){
    // setUpTable();
    getWorkers();

  }
  else {
    location.href = '/login/'
  }

});
