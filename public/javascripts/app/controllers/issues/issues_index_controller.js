angular.module('app.controllers')

.controller('IssuesController', function($scope, appSession, API, $http, $timeout, appAuth) {

  $scope.session = appSession;


  $scope.alerts = {
    success: [],
    error: []
  }

  var getIssues = function () {
    $http.get(API + '/issues')
    .then(function(response) {
      console.log(response.data);
      $scope.issues = response.data;
    }, function(response){
      console.log(response);
    });
  };

  $scope.idToDate = function(mongoId) {
    var timestamp = mongoId.toString().substring(0,8)
    var date =  new Date( parseInt( timestamp, 16 ) * 1000 )
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return day + '/' + month + '/' + year;
  }

  $scope.viewIssue = function(issue_index) {
    location.href = '#/issues/' + $scope.issues[issue_index]._id
  }


  if ($scope.session.requireLogin()){
    if ($scope.hasAccess('is_index')) {
    getIssues();
    }
    else {
      location.href = '#/403'
    }
  }
  else {
    location.href = '/login/'
  }

});
