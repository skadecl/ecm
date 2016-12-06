angular.module('app.controllers')

.controller('NewItemController', function($scope, appSession, API, $http, $timeout, appAuth) {

  $scope.session = appSession;
  $scope.alerts = {
    success: [],
    error: []
  }

  if ($scope.session.requireLogin()){
    if ($scope.hasAccess('st_add')) {
      $scope.new_item = {}
    }
    else {
      location.href = '#/403'
    }
  }
  else {
    location.href = '/login/'
  }

  $scope.createItem = function(){
    if ($scope.new_item){
      $scope.alerts.success = []
      $scope.alerts.error = []

      $http.post(API + '/items', {new_item: $scope.new_item})
      .then(function(response) {
        $scope.alerts.success.push(response.data);
        $('#items-alerts').modal('show');
        $scope.new_item = {}
      }, function(response){
        $scope.alerts.error.push(response.data);
        $('#items-alerts').modal('show');
      });
    }
  };

});
