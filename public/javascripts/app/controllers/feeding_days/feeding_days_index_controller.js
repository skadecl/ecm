angular.module('app.controllers')

.controller('FeedingDayController', function($scope, appSession, API, $http, $timeout, appAuth) {

  var getFeedingDay = function (timestamp) {
    $http.get(API + '/feeding_days/' + timestamp)
    .then(function(response) {
      $scope.feeding_day = response.data;
    }, function(response){
      $scope.feeding_day = {}
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

  $scope.session = appSession;
  $scope.format = 'dd/MM/yyyy'
  $scope.datepicker = {
    opened: false
  };

  $scope.today = function () {
    $scope.selectedDate = new Date();
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
    getFeedingDay($scope.selectedDate.getTime())
  })

  if ($scope.session.requireLogin()){
    if ($scope.hasAccess('fd_history')) {
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
