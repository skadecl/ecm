angular.module('app.controllers')

.controller('FeedingController', function($scope, appSession, API, $http, $timeout, appAuth, $routeParams) {

  $scope.session = appSession;
  $scope.alerts = {
    success: [],
    error: []
  }

  $scope.editable = false;

  var getFeeding = function () {
    $http.get(API + '/feeding/' + $routeParams.feeding_id)
    .then(function(response) {
      $scope.feeding = response.data;
    }, function(response){
      console.log(response);
    });
  };

  $scope.saveFeeding = function () {
    $scope.alerts.success = []
    $scope.alerts.error = []

    $http.patch(API + '/feeding/' + $scope.feeding._id, {feeding: $scope.feeding})
    .then(function(response) {
      $scope.editable = false;
      $scope.alerts.success.push(response.data);
    }, function(response){
      $scope.alerts.error.push(response.data);
    })
    .finally(function() {
      $('#feeding-alerts').modal('show');
    });
  }


  if ($scope.session.requireLogin()){
    if ($scope.hasAccess('fd_view')) {
      getFeeding();
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
