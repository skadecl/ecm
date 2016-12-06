angular.module('app.controllers')

.controller('UsersController', function($scope, appSession, API, $http, $timeout, appAuth) {

  $scope.session = appSession;


  $scope.alerts = {
    success: [],
    error: []
  }


  var getUsers = function () {
    $http.get(API + '/users')
    .then(function(response) {
      $scope.users = response.data;
    }, function(response){
      console.log(response);
    });
  };


  $scope.viewUser = function(user_index) {
    location.href = '#/users/' + $scope.users[user_index]._id
  }


  if ($scope.session.requireLogin()){
    if ($scope.session.data.admin) {
      getUsers();
    }
    else {
      location.href = '#/403'
    }
  }
  else {
    location.href = '/login/'
  }

});
