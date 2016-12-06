angular.module('app.controllers')

.controller('HousingsController', function($scope, appSession, API, $http, $timeout, appAuth) {

  $scope.session = appSession;

  var getHousings = function () {
    $http.get(API + '/housing')
    .then(function(response) {
      $scope.housings = response.data;
      console.log($scope.housings);
    }, function(response){
      console.log(response);
    });
  };

  $scope.viewHousing = function(housing_index) {
    location.href = '#/housing/' + $scope.housings[housing_index]._id
  }


  if ($scope.session.requireLogin()){
    if ($scope.hasAccess('hs_index')) {
      getHousings();
    }
    else {
      location.href = '#/403'
    }

  }
  else {
    location.href = '/login/'
  }

});
