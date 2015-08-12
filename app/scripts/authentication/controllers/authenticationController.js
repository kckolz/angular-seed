'use strict';

 angular.module('angularSeed')
 .controller('AuthenticationController', function ($scope, $log, AuthenticationService) {
  $scope.loginUser = function () {
    AuthenticationService.authenticate($scope.login.username, $scope.login.password).then(function (oauth) {
      //if we were successful, emit loggedIn event
      $scope.$emit('loggedIn');
    }, function(error) {
      $log.error("Error authenticating user");
    });
  };
});
