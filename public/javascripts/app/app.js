angular.module('app', ['app.services', 'app.routes', 'app.controllers'])
.constant('API', 'http://104.251.215.108:9999/api')
.config(function($httpProvider) {
  $httpProvider.interceptors.push('httpInterceptor');
});
