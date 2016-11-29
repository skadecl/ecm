angular.module('app.controllers')

.controller('LoginCtrl', function($scope, appSession, API, $http, $window) {

  $scope.session = appSession;

  $scope.loginRut = '';
  $scope.loginPass = '';

  if ($scope.session.isAuthed()) {
    location.href = '/panel/'
  }

  $scope.doLogin = function() {
    $scope.invalid = false;
    $scope.error = false;
    $('.btn-login').attr('disabled', true);
    $('.login-btn-text').html('Ingresando...');
    $scope.session.logIn($scope.loginRut, $scope.loginPass).then(function(){
      //SUCCESS
      location.href = '/panel/';
    }, function(res) {
      //FAIL
      if (res.status == 401){
        $scope.invalid = true;
      }
      else {
        $scope.error = true;
      }
    }).finally(function(){
      $('.btn-login').attr('disabled', false);
      $('.login-btn-text').html('Ingresar');
    });
  };

});
