'use strict';

angular.module('angularSeed')
.controller('WelcomeController', function ($scope, $log) {
  $log.info("Welcome");
  $scope.introText = "This is a baseline project used for angular web applications";
});




