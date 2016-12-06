angular.module('app.controllers')

.controller('NewHousingController', function($scope, appSession, API, $http, $timeout, appAuth) {

  $scope.session = appSession;
  $scope.alerts = {
    success: [],
    error: []
  }

  if ($scope.session.requireLogin()){
    if ($scope.hasAccess('hs_add')) {
      $scope.new_housing = {}
    }
    else {
      location.href = '#/403'
    }
  }
  else {
    location.href = '/login/'
  }

  $scope.createHousing = function(){
    if ($scope.new_housing){
      $scope.alerts.success = []
      $scope.alerts.error = []

      $http.post(API + '/housing', {new_housing: $scope.new_housing})
      .then(function(response) {
        $scope.alerts.success.push(response.data);
        $('#housing-alerts').modal('show');
        $scope.new_housing = {}
      }, function(response){
        $scope.alerts.error.push(response.data);
        $('#housing-alerts').modal('show');
      });
    }
  };

});
