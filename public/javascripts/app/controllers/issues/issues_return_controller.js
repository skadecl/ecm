angular.module('app.controllers')

.controller('ReturnIssueController', function($scope, appSession, API, $http, $timeout, appAuth, $routeParams) {

  $scope.session = appSession;
  $scope.alerts = {
    success: [],
    error: []
  }

  $scope.selectedItem = ""

  var itemToReturn = {}

  $scope.searchItem = function(typedItem){
    if (typedItem && typedItem.length > 2){
      $http.get(API + '/items/search/' + typedItem)
      .then(function(response) {
        $scope.newItems = response.data;
        $scope.newItemsInfo = []

        for (var i = 0 ; i < $scope.newItems.length ; i++) {
          $scope.newItemsInfo[i] = $scope.newItems[i].info
        }

      });
    }else {
      return
    }
  }

  $scope.selectItem = function(selected){
    var temp_items = $scope.newItems;

    for (var i = 0 ; i < temp_items.length ; i++) {
      if (temp_items[i].info == selected) {
        if (temp_items[i].issue != null) {
          itemToReturn = temp_items[i]
          $scope.itemError = false;
          $scope.isReady = true;
        }
        else {
          $scope.isReady = false;
          $scope.itemError = true;
        }
      }
    }
  }


  $scope.returnIssue = function () {
    $scope.alerts.success = []
    $scope.alerts.error = []

    $http.delete(API + '/issues/' + itemToReturn.issue)
    .then(function(response) {
      $scope.alerts.success.push(response.data);
      $scope.selectedItem = ""
      $scope.isReady = false;
    }, function(response){
      $scope.alerts.error.push(response.data);
    })
    .finally(function() {
      $('#issues-alerts').modal('show');
    });
  }


  if ($scope.session.requireLogin()){
    if ($scope.hasAccess('is_delete')) {
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
