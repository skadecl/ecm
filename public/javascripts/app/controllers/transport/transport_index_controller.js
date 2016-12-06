angular.module('app.controllers')

.controller('TransportController', function($scope, appSession, API, $http, $timeout, appAuth) {

  var getTransport = function (timestamp) {
    $http.get(API + '/transport/' + timestamp)
    .then(function(response) {
      $scope.transport = response.data;
    }, function(response){
      $scope.transport = {}
    });
  };

  $scope.getddMMyyyy = function (date) {
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return day + '/' + month + '/' + year;
  }

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }

  var passengerToAdd = {}

  $scope.alerts = {
    success: [],
    error: []
  }

  $scope.selectedPassenger = ""
  $scope.gotWorker = false;
  $scope.session = appSession;
  $scope.format = 'dd/MM/yyyy'
  $scope.formError = false;
  $scope.new_passenger = {}

  $scope.datepicker = {
    opened: false
  };

  $scope.today = function () {
    $scope.selectedDate = new Date();
    $scope.todays_date = $scope.selectedDate
  }

  $scope.inlineOptions = {
    customClass: getDayClass,
    showWeeks: false
  };

  $scope.dateOptions = {
    formatYear: 'yyyy',
    startingDay: 1
  };

  $scope.openDatepicker = function() {
    $scope.datepicker.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.selectedDate = new Date(day, month, year);
  };

  $scope.$watch('selectedDate', function() {
    getTransport($scope.selectedDate.getTime())
  })

  $scope.canAddPassengers = function() {
    return $scope.selectedDate.getTime() >= $scope.todays_date.getTime()
  }

  $scope.newPassengerOpen = function() {
    $('#modal-new-passenger').modal('show')
  }

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
    var temp_Workers = $scope.newWorkers;

    for (var i = 0 ; i < temp_Workers.length ; i++) {
      if (temp_Workers[i].info == selected) {
        $scope.gotWorker = true;
        passengerToAdd = temp_Workers[i];
      }
    }
  }

  $scope.checkForm = function () {
    if ($scope.new_passenger.direction == null || $scope.new_passenger.origin == null || $scope.new_passenger.destination == null) {
      $scope.formError = true;
    }
    else {
      $scope.formError = false;
      $scope.new_passenger.worker = passengerToAdd._id
      addPassenger()
      $('#modal-new-passenger').modal('hide')
    }
  }

  var addPassenger = function(){
    $scope.alerts.success = []
    $scope.alerts.error = []

    $http.post(API + '/transport/' + $scope.selectedDate.getTime(), {new_passenger: $scope.new_passenger})
    .then(function(response) {
      $scope.alerts.success.push(response.data);
      $scope.selectedPassenger = ""
      $scope.new_passenger = {}
      $scope.gotWorker = false;
      getTransport($scope.selectedDate.getTime())
    }, function(response){
      $scope.alerts.error.push(response.data);
    })
    .finally(function(){
      $timeout(function () {
        $('#transport-alerts').modal('show');
      }, 500);
    });
  }


  if ($scope.session.requireLogin()){
    if ($scope.hasAccess('tp_index')) {
      $scope.today();
    }
    else {
      location.href = '#/403'
    }
  }
  else {
    location.href = '/login/'
  }



});
