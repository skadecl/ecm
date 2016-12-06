angular.module('app.controllers')

.controller('FeedingsController', function($scope, appSession, API, $http, $timeout, appAuth) {

  $scope.session = appSession;


  $scope.alerts = {
    success: [],
    error: []
  }

  var getFeedings = function () {
    $http.get(API + '/feeding')
    .then(function(response) {
      console.log(response.data);
      $scope.feedings = response.data;
    }, function(response){
      console.log(response);
    });
  };

  $scope.getStatus = function(item_status) {
    if (item_status == null) return 'Disponible'
    else return 'En Prestamo'
  }

  $scope.viewFeeding = function(feeding) {
    location.href = '#/feeding/' + $scope.feedings[feeding]._id
  }


  if ($scope.session.requireLogin()){

    if ($scope.hasAccess('fd_index')) {
      getFeedings();
    }
    else {
      location.href = '#/403'
    }

  }
  else {
    location.href = '/login/'
  }

});
