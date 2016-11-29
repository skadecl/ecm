angular.module('app.controllers')

.controller('MainCtrl', function($scope, appSession, API, $http, $timeout, appAuth) {

  $scope.session = appSession;

  if ($scope.session.requireLogin()){
  }
  else {
    location.href = '/login/'
  }
});
