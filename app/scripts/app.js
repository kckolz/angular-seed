'use strict';

 angular
 .module('angularSeed', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ui.router',
  'ngSanitize',
  'ui.bootstrap',
  'config'
  ])
 .config(function ($urlRouterProvider, $stateProvider, $locationProvider) {

    // HTML5 Mode enabled to remove # from URL
    // $locationProvider.html5Mode(true);

    // For any unmatched url, redirect to the dashboard
    $urlRouterProvider.otherwise("welcome");

    // Now set up the states
    $stateProvider.state('welcome', {
      url: "/",
      templateUrl: "views/welcome/welcome.html",
      controller: 'WelcomeController'
    })

  }).config(function($httpProvider) {

    $httpProvider.interceptors.push(function (AuthenticationService, $q) {

      return {
        // Decorate requests with the auth header
        request: function (config) {
          var deferred = $q.defer();
          AuthenticationService.getAccessToken().then(function(accessToken) {
            config.headers.Authorization = 'Bearer ' + accessToken;
            deferred.resolve(config);
          }).catch(function(error){
            // Just return it without adding the auth headers.
            deferred.resolve(config);
          });
          return deferred.promise;
        }
      };
  });
    
  }).run(function($rootScope, $state, $log, $urlRouter, $window, AuthenticationService) {

    $rootScope.$on('$locationChangeSuccess', function(event, state) {

      // Send page info to google analytics on location change
      $window.ga('send', 'pageview', { page: $state.current.url });

      // If we are authenticated or trying to access a non secure route, no worries
      if (AuthenticationService.isAuthenticated()) return;

      // Prevent $urlRouter's default handler from firing
      event.preventDefault();

      $state.go('welcome');
    });

    $rootScope.$on('$stateChangeStart', function (event, toState) {

      $rootScope.loading = true;
      $rootScope.isAuthenticated = AuthenticationService.isAuthenticated();

      // If we aren't authorized don't go anywhere
      if (!$rootScope.isAuthenticated) {
        // event.preventDefault();
        // $rootScope.loading = false;
      }
    });

    $rootScope.$on('$stateChangeSuccess', function() { 
      $rootScope.loading = false;
    });

    $rootScope.$on('showLoading', function() {
      $rootScope.loading = true;
    });

    $rootScope.$on('hideLoading', function() {
      $rootScope.loading = false;
    }); 
  })