angular.module('app.routes', ['ngRoute'])

.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/templates/index.html'
    })
    .when('/403', {
      templateUrl: '/templates/errors/403.html'
    })
    .when('/404', {
      templateUrl: '/templates/errors/404.html'
    })
    .otherwise({
      redirectTo: '/404'
    });
});
