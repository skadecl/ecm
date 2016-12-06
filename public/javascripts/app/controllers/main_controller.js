angular.module('app.controllers')

.controller('MainCtrl', function($scope, appSession, API, $http, $timeout, appAuth) {

  $scope.session = appSession;


  $scope.logOut = function(){
    appSession.logOut()
  }

  $scope.hasAccess = function(access) {
    return $scope.access[access];
  }


  // var getAccess = function () {
  //   $http.get(API + '/utils/access')
  //   .then(function(response) {
  //     console.log(response.data);
  //     $scope.access = response.data;
  //   }, function(response){
  //     $scope.access = {}
  //   });
  // };

  $scope.canSeeMenu = function(menu) {
    switch (menu) {
      case 'hr':
        return ($scope.access['hr_add'] || $scope.access['hr_index'])
        break;
      case 'hs':
        return ($scope.access['hs_add'] || $scope.access['hs_index'])
        break
      case 'tp':
        return ($scope.access['tp_index'] || $scope.access['tp_add'] || $scope.access['tp_delete'])
        break
      case 'fd':
        return ($scope.access['fd_add'] || $scope.access['fd_index'] || $scope.access['fd_history'] || $scope.access['fd_assign'])
        break
      case 'st':
        return ($scope.access['st_add'] || $scope.access['st_index'] || $scope.access['is_index'] || $scope.access['is_add'] || $scope.access['is_delete'])
      default:
        return false
        break
    }
  }

  if ($scope.session.requireLogin()){
    $scope.access = $scope.session.data.access
    // getAccess()
  }
  else {
    location.href = '/login/'
  }
});
