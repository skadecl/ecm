angular.module('app.controllers')

.controller('FeedingAssignController', function($scope, appSession, API, $http, $timeout, appAuth) {

  var getTodaysDate = function() {
        var date =  new Date()
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        return day + '/' + month + '/' + year;
      }

  $scope.session = appSession;
  $scope.alerts = {
    success: [],
    error: []
  }

  $scope.selectedWorker = ""
  $scope.isInfoReady = false
  $scope.todays_date = getTodaysDate()

  var workerToFeed = {}

  $scope.assignMeal = function(meal_name){
    $scope.alerts.success = []
    $scope.alerts.error = []

    $http.get(API + '/feeding_days/today/assign/' + workerToFeed._id + '/' + meal_name)
    .then(function(response) {
      $scope.alerts.success.push(response.data);
      $scope.feeding_status[meal_name] = true
      $('#feeding-alerts').modal('show');
    }, function(response){
      $scope.alerts.error.push(response.data);
      $('#feeding-alerts').modal('show');
    });
  };

  $scope.searchWorker = function(typedWorker){
    if (typedWorker && typedWorker.length > 2){
      $http.get(API + '/workers/search/' + typedWorker)
      .then(function(response) {
        $scope.newWorkers = response.data;
        $scope.newWorkersInfo = []

        for (var i = 0 ; i < $scope.newWorkers.length ; i++) {
          $scope.newWorkersInfo[i] = $scope.newWorkers[i].info
        }

      });
    }else {
      return
    }
  }

  $scope.selectWorker = function(selected){
    var temp_workers = $scope.newWorkers;

    for (var i = 0 ; i < temp_workers.length ; i++) {
      if (temp_workers[i].info == selected) {
        workerToFeed = temp_workers[i];
        getWorkerFeeding()
      }
    }
  }

  var getWorkerFeeding = function () {
    $http.get(API + '/workers/' + workerToFeed._id + '/feeding')
    .then(function(response) {
      $scope.worker = response.data;
      getFeedingStatus()
    }, function(response){
      console.log(response);
    });
  };

  var getFeedingStatus = function () {
    $http.get(API + '/feeding_days/today/status/' + workerToFeed._id)
    .then(function(response) {
      console.log(response.data);
      $scope.feeding_status = response.data;
      $scope.isInfoReady = true
    }, function(response){
      console.log(response);
    });
  }

  if ($scope.session.requireLogin()){

    if ($scope.hasAccess('fd_assign')) {
      $scope.new_item = {}
    }
    else {
      location.href = '#/403'
    }

  }
  else {
    location.href = '/login/'
  }

});
