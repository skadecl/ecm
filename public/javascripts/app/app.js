angular.module('app', ['app.services', 'app.routes', 'app.controllers'])
.constant('API', 'http://localhost:8080/api')
.config(function($httpProvider) {
  $httpProvider.interceptors.push('httpInterceptor');
});
