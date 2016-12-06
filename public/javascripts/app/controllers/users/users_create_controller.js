angular.module('app.controllers')

.controller('NewUserController', function($scope, appSession, API, $http, $timeout, appAuth) {

  $scope.session = appSession;
  $scope.alerts = {
    success: [],
    error: []
  }

  if ($scope.session.requireLogin()){
    if ($scope.session.data.admin) {
      $scope.new_user = {}
    }
    else {
      location.href = '#/403'
    }
  }
  else {
    location.href = '/login/'
  }

  $scope.createUser = function(){
    if ($scope.new_user){
      $scope.alerts.success = []
      $scope.alerts.error = []

      $http.post(API + '/users', {new_user: $scope.new_user})
      .then(function(response) {
        $scope.alerts.success.push(response.data);
        $('#users-alerts').modal('show');
        $scope.new_user = {}
      }, function(response){
        $scope.alerts.error.push(response.data);
        $('#users-alerts').modal('show');
      });
    }
  };

});
