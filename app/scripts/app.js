'use strict';

/**
 * @ngdoc overview
 * @name myangularApp
 * @description
 * # myangularApp
 *
 * Main module of the application.
 */
/*angular
  .module('myangularApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'partials/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/rest', {
        templateUrl: 'partials/rest.html',
        controller: 'RestCtrl',
        controllerAs: 'rest'
      })
      .otherwise({
        redirectTo: '/'
      });
  });*/

angular.module('myangularApp', ['ui.router', 'ngResource','file-model', 'myangularApp.controllers', 'myangularApp.services' ]);

angular.module('myangularApp').config(function($stateProvider, $httpProvider) {
  $stateProvider.state('movies', { // state for showing all movies
    url: '/movies',
    templateUrl: 'partials/movies.html',
    controller: 'MovieListController'
  }).state('viewMovie', { //state for showing single movie
    url: '/movies/:id/view',
    templateUrl: 'partials/movie-view.html',
    controller: 'MovieViewController'
  }).state('newMovie', { //state for adding a new movie
    url: '/movies/new',
    templateUrl: 'partials/movie-add.html',
    controller: 'MovieCreateController'
  }).state('editMovie', { //state for updating a movie
    url: '/movies/:id/edit',
    templateUrl: 'partials/movie-edit.html',
    controller: 'MovieEditController'
  });
}).run(function($state) {
  $state.go('movies'); //make a transition to movies state when app starts
});

/*angular.module('myangularApp').directive('fileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;

      element.bind('change', function(){
        scope.$apply(function(){
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
}]);*/
