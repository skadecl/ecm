angular.module('app.services')

.factory('httpInterceptor', function(appAuth, API) {
  return {
    request: function(config) {
      var sessionToken = appAuth.getToken();

      if (config.url.indexOf(API) === 0 && sessionToken) {
        config.headers['token'] = sessionToken;
      }
      return config;
    },

    response: function(res) {

      if (res.config.url.indexOf(API) === 0 && res.data.sessionToken) {
        appAuth.saveToken(res.data.sessionToken);
      }
      return res;
    }
  }
});
