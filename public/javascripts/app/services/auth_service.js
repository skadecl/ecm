angular.module('app.services')

.factory('appAuth', function($window, $rootScope) {

  return {

    parseToken: function(token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse($window.atob(base64));
    },

    saveToken: function(token) {
      $window.localStorage['session-token'] = token;
      //$rootScope.$broadcast('newToken', self.parseToken(token));
    },

    getToken: function() {
      return $window.localStorage['session-token'];
    },

    removeToken: function() {
      $window.localStorage.removeItem('session-token');
    }
  }
});
