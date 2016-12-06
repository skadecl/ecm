angular.module('app.services')

.service('appSession', function($window, $http, API, appAuth, $rootScope, $location) {

  var self = this;

  self.data = {};

  self.save = function() {
    if (self.data) {
      $window.localStorage['sessData'] = $window.btoa(JSON.stringify(self.data));
    }
  };

  self.restore = function() {
    var lsData = $window.localStorage['sessData'];
    if (lsData) {
      self.data = JSON.parse($window.atob(lsData));
      // appNotify.enable();
    }
  };

  self.logIn = function(user_rut, pass) {
    // TODO: update models and login
    // TODO: handle errors

    return $http.post(API + '/sign_in', {
      rut: user_rut,
      password: pass
    }).then(function(res){
      self.data.active = true;
      self.data.token = appAuth.parseToken(appAuth.getToken());
      self.data = res.data.userData;
      self.save();
      // appNotify.enable();
    });
  };

  self.logOut = function() {
    location.href = '/'
    appAuth.removeToken();
    self.data = {};
    self.save();
    // appNotify.disable();
    // TODO: Handle better
  };

  self.isAuthed = function() {
    var sessionToken = appAuth.getToken();

    if (sessionToken) {
      var tokenParams = appAuth.parseToken(sessionToken);
      return Math.round(new Date().getTime() / 1000) <= tokenParams.exp;
    } else {
      return false;
    }
  };

  self.requireLogin = function(){
    if(!self.isAuthed()){
      location.href = '/login/'
      return false;
    }
    else {
      return true;
    }
  };

  self.updateUserData = function(userdata){
    self.data.user = userdata;
    self.save();
  }

  $rootScope.$on('newToken', function(event, token) {
    self.data.user = appAuth.parseToken(token);
    self.save();
  });

  //--- INIT SESSION
  self.restore();
});
