angular.module('app.controllers')

.controller('HousingController', function($scope, appSession, API, $http, $timeout, appAuth, $routeParams) {

  $scope.session = appSession;
  $scope.alerts = {
    success: [],
    error: []
  }

  $scope.selectedResident = ""
  $scope.editable = false;
  $scope.isSelected = false;

  var residentToAdd = {}

  var getHousing = function () {
    $http.get(API + '/housing/' + $routeParams.housing_id)
    .then(function(response) {
      $scope.housing = response.data;
      console.log($scope.housing.people.length);
    }, function(response){
      console.log(response);
    });
  };

  $scope.viewWorker = function(index) {
    location.href = '#/workers/' + $scope.housing.people[index]._id
  }

  $scope.hasCapacity = function(){
    if ($scope.housing) {
      return $scope.housing.people.length < $scope.housing.capacity;
    }else {
      return false;
    }
  }

  $scope.saveHousing = function () {
    $scope.alerts.success = []
    $scope.alerts.error = []

    $http.patch(API + '/housing/' + $scope.housing._id, {housing: $scope.housing})
    .then(function(response) {
      $scope.editable = false;
      $scope.alerts.success.push(response.data);
    }, function(response){
      $scope.alerts.error.push(response.data);
    })
    .finally(function() {
      $('#housing-alerts').modal('show');
    });
  }

  $scope.deleteHousing = function () {
    $scope.alerts.success = []
    $scope.alerts.error = []

    $http.delete(API + '/housing/' + $scope.housing._id)
    .then(function(response) {
      $scope.editable = false;
      $scope.alerts.success.push(response.data);
      $scope.housing = null;
    }, function(response){
      $scope.alerts.error.push(response.data);
    })
    .finally(function() {
      $('#housing-alerts').modal('show');
    });
  }

  $scope.newResidentOpen = function(){
    $('#modal-new-resident').modal('show');
  }

  $scope.searchWorker = function(typedWorker){
    if (typedWorker && typedWorker.length > 2){
      $http.get(API + '/workers/search/' + typedWorker)
      .then(function(response) {
        $scope.newResidents = response.data;
        $scope.newResidentsInfo = []

        for (var i = 0 ; i < $scope.newResidents.length ; i++) {
          $scope.newResidentsInfo[i] = $scope.newResidents[i].info
        }

      });
    }else {
      return
    }
  }

  $scope.addResident = function(){
    $scope.alerts.success = []
    $scope.alerts.error = []

    $http.get(API + '/housing/' + $scope.housing._id + '/add/' + residentToAdd._id)
    .then(function(response) {
      $scope.isSelected = false;
      $scope.housing.people.push(response.data.worker);
      $scope.alerts.success.push(response.data);
      $scope.selectedResident = ""
    }, function(response){
      $scope.alerts.error.push(response.data);
    })
    .finally(function(){
      $timeout(function () {
        $('#housing-alerts').modal('show');
      }, 500);
    });
  }

  $scope.removeResident = function(residentIndex) {
    $scope.alerts.success = []
    $scope.alerts.error = []

    $http.get(API + '/housing/' + $scope.housing._id + '/remove/' + $scope.housing.people[residentIndex]._id)
    .then(function(response) {
      $scope.housing.people.splice(residentIndex, 1);
      $scope.alerts.success.push(response.data);
    }, function(response){
      $scope.alerts.error.push(response.data);
    })
    .finally(function() {
      $('#housing-alerts').modal('show');
    });
  }

  $scope.selectResident = function(selected){
    var temp_Residents = $scope.newResidents;

    for (var i = 0 ; i < temp_Residents.length ; i++) {
      if (temp_Residents[i].info == selected) {
        $scope.isSelected = true;
        residentToAdd = temp_Residents[i];
      }
    }
  }


  if ($scope.session.requireLogin()){
    if ($scope.hasAccess('hs_view')) {
      getHousing();
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
