angular.module('app.routes', ['ngRoute'])

.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '../templates/index.html'
    })
    .when('/workers-create', {
      templateUrl: '../templates/workers/workers_create.html',
      controller: 'NewWorkerController'
    })
    .when('/workers', {
      templateUrl: '../templates/workers/workers_index.html',
      controller: 'WorkersController'
    })
    .when('/workers/:worker_id', {
      templateUrl: '../templates/workers/workers_view.html',
      controller: 'WorkerController'
    })
    .when('/housing', {
      templateUrl: '../templates/housing/housing_index.html',
      controller: 'HousingsController'
    })
    .when('/housing-create', {
      templateUrl: '../templates/housing/housing_create.html',
      controller: 'NewHousingController'
    })
    .when('/housing/:housing_id', {
      templateUrl: '../templates/housing/housing_view.html',
      controller: 'HousingController'
    })
    .when('/items', {
      templateUrl: '../templates/items/items_index.html',
      controller: 'ItemsController'
    })
    .when('/items/:item_id', {
      templateUrl: '../templates/items/items_view.html',
      controller: 'ItemController'
    })
    .when('/items-create', {
      templateUrl: '../templates/items/items_create.html',
      controller: 'NewItemController'
    })
    .when('/issues', {
      templateUrl: '../templates/issues/issues_index.html',
      controller: 'IssuesController'
    })
    .when('/issues-create', {
      templateUrl: '../templates/issues/issues_create.html',
      controller: 'NewIssueController'
    })
    .when('/issues/return', {
      templateUrl: '../templates/issues/issues_return.html',
      controller: 'ReturnIssueController'
    })
    .when('/feeding-create', {
      templateUrl: '../templates/feeding/feeding_create.html',
      controller: 'NewFeedingController'
    })
    .when('/feeding', {
      templateUrl: '../templates/feeding/feeding_index.html',
      controller: 'FeedingsController'
    })
    .when('/feeding/:feeding_id', {
      templateUrl: '../templates/feeding/feeding_view.html',
      controller: 'FeedingController'
    })
    .when('/feeding-assign', {
      templateUrl: '../templates/feeding/feeding_assign.html',
      controller: 'FeedingAssignController'
    })
    .when('/feeding-day', {
      templateUrl: '../templates/feeding_days/feeding_days_index.html',
      controller: 'FeedingDayController'
    })
    .when('/transport', {
      templateUrl: '../templates/transport/transport_index.html',
      controller: 'TransportController'
    })
    .when('/users-create', {
      templateUrl: '../templates/users/users_create.html',
      controller: 'NewUserController'
    })
    .when('/users', {
      templateUrl: '../templates/users/users_index.html',
      controller: 'UsersController'
    })
    .when('/users/:user_id', {
      templateUrl: '../templates/users/users_view.html',
      controller: 'UserController'
    })
    .when('/403', {
      templateUrl: '../templates/errors/403.html'
    })
    .when('/404', {
      templateUrl: '../templates/errors/404.html'
    })
    .otherwise({
      redirectTo: '/404'
    });
});
