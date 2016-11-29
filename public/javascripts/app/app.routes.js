angular.module('app.routes', ['ngRoute'])

.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/templates/index.html'
    })
    .when('/workers/', {
      templateUrl: 'templates/workers.html'
    })
    .when('/worker/new', {
      templateUrl: 'templates/workers_create.html',
      controller: 'NewWorkerController'
    })
    .when('/workers', {
      templateUrl: 'templates/workers.html',
      controller: 'WorkersController'
    })
    .when('/worker/:worker_id', {
      templateUrl: 'templates/worker.html',
      controller: 'WorkerController'
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
