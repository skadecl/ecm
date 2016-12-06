angular.module('app', ['app.services', 'app.routes', 'app.controllers'])
.constant('API', 'http://172.20.10.2:8080/api')
.config(function($httpProvider) {
  $httpProvider.interceptors.push('httpInterceptor');
});
