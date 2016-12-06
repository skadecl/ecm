angular.module('app.controllers')

.controller('NewFeedingController', function($scope, appSession, API, $http, $timeout, appAuth) {

  $scope.session = appSession;
  $scope.alerts = {
    success: [],
    error: []
  }

  if ($scope.session.requireLogin()){

    if ($scope.hasAccess('fd_add')) {
      $scope.new_feeding = {}
    }
    else {
      location.href = '#/403'
    }

  }
  else {
    location.href = '/login/'
  }

  $scope.createFeeding = function(){
    if ($scope.new_feeding){
      $scope.alerts.success = []
      $scope.alerts.error = []

      $http.post(API + '/feeding', {new_feeding: $scope.new_feeding})
      .then(function(response) {
        $scope.alerts.success.push(response.data);
        $('#feeding-alerts').modal('show');
        $scope.new_feeding = {}
      }, function(response){
        $scope.alerts.error.push(response.data);
        $('#feeding-alerts').modal('show');
      });
    }
  };

});
