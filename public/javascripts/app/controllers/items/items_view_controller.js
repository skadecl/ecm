angular.module('app.controllers')

.controller('ItemController', function($scope, appSession, API, $http, $timeout, appAuth, $routeParams) {

  $scope.session = appSession;
  $scope.alerts = {
    success: [],
    error: []
  }

  var getItem = function () {
    $http.get(API + '/items/' + $routeParams.item_id)
    .then(function(response) {
      $scope.item = response.data;
      $scope.item.admin = $scope.item.admin ? "1" : "0"
    }, function(response){
      console.log(response);
    });
  };

  $scope.saveItem = function () {
    $scope.alerts.success = []
    $scope.alerts.error = []

    $http.patch(API + '/items/' + $scope.item._id, {item: $scope.item})
    .then(function(response) {
      $scope.editable = false;
      $scope.alerts.success.push(response.data);
    }, function(response){
      $scope.alerts.error.push(response.data);
    })
    .finally(function() {
      $('#items-alerts').modal('show');
    });
  }

  $scope.deleteItem = function () {
    $scope.alerts.success = []
    $scope.alerts.error = []

    $http.delete(API + '/items/' + $scope.item._id)
    .then(function(response) {
      $scope.editable = false;
      $scope.alerts.success.push(response.data);
      $scope.item = null;
    }, function(response){
      $scope.alerts.error.push(response.data);
    })
    .finally(function() {
      $('#items-alerts').modal('show');
    });
  }


  if ($scope.session.requireLogin()){
    if ($scope.hasAccess('st_view')) {
      getItem();
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
