angular.module('app.controllers')

.controller('UserController', function($scope, appSession, API, $http, $timeout, appAuth, $routeParams) {

  $scope.session = appSession;
  $scope.alerts = {
    success: [],
    error: []
  }

  var getUser = function () {
    $http.get(API + '/users/' + $routeParams.user_id)
    .then(function(response) {
      $scope.user = response.data;
      $scope.user.admin = $scope.user.admin ? "1" : "0"
    }, function(response){
      console.log(response);
    });
  };

  $scope.saveUser = function () {
    $scope.alerts.success = []
    $scope.alerts.error = []

    $http.patch(API + '/users/' + $scope.user._id, {user: $scope.user})
    .then(function(response) {
      $scope.editable = false;
      $scope.alerts.success.push(response.data);
    }, function(response){
      $scope.alerts.error.push(response.data);
    })
    .finally(function() {
      $('#users-alerts').modal('show');
    });
  }

  $scope.deleteUser = function () {
    $scope.alerts.success = []
    $scope.alerts.error = []

    $http.delete(API + '/users/' + $scope.user._id, {user: $scope.user})
    .then(function(response) {
      $scope.editable = false;
      $scope.alerts.success.push(response.data);
      $scope.user = null;
    }, function(response){
      $scope.alerts.error.push(response.data);
    })
    .finally(function() {
      $('#user-alerts').modal('show');
    });
  }


  if ($scope.session.requireLogin()){
    if ($scope.session.data.admin) {
      getUser();
      $scope.editable = false;
    }
    else {
      location.href = '#/403'
    }
  }
  else {
    location.href = '/login/'
  }

});
