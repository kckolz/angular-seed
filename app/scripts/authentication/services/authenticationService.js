'use strict';

angular.module('angularSeed')
.factory('AuthenticationService', function(PathConstants, $injector, $q, $log){

  var __refreshTokenDeferred,
      __oauth,
      service = {};

  function __clear() {
    localStorage.removeItem("oauth");
    localStorage.removeItem("userAccount");
    __oauth = null;
    __refreshTokenDeferred = null;
  }

  function __getOauth() {
    if (!__oauth) {
      __oauth = JSON.parse(localStorage.getItem("oauth"));
      if (__oauth) {
        __oauth.expirationTime = new Date(__oauth.expirationTime);
      }
    }
    return __oauth;
  }

  function __setOauth(oauth) {
    __oauth = oauth;
    if (!__oauth.expirationTime) {
      __oauth.expirationTime = new Date((new Date().getTime()) + (__oauth.expires_in * 1000));
    }
    localStorage.setItem("oauth", JSON.stringify(oauth));
  }

  service.getOauth = function() {
    return __getOauth();
  };

  service.setOauth = function(oauth) {
    __setOauth(oauth);
  };

  service.isAuthenticated = function() {
    return !!__getOauth();
  };

  service.authenticate = function(username, password) {

    var deferred = $q.defer();
    var $http = $injector.get('$http');
    var oauthRequest = 'grant_type=password&username='+ username + '&password=' + password;
    $http.post(PathConstants.BASE_URL + PathConstants.LOGIN_PATH, oauthRequest, {
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      }
    })
    .success(function(data){
      $log.info(data);
      __setOauth(data);
      deferred.resolve(__getOauth());
    })
    .error(function() {
      __clear();
      deferred.reject("Authentication failed.");
    });
    return deferred.promise;
  };

  // Uses .ajax do avoid the $http interceptor
  service.refreshToken = function () {
    if (!__refreshTokenDeferred) {
      __refreshTokenDeferred = $q.defer();
      $.ajax({
        type: 'POST',
        url: PathConstants.BASE_URL + PathConstants.REFRESH_PATH,
        headers: {"Authorization": "Bearer " + __getOauth().access_token},
        data: {"grant_type": "refresh_token", "refresh_token": __getOauth().refresh_token},
        success: function (data) {
          __setOauth(data);
          __refreshTokenDeferred.resolve(__getOauth());
          __refreshTokenDeferred = null;
        },
        error: function (jqxhr, status, error) {
          __refreshTokenDeferred.reject("Token refresh failed.");
          __clear();
        }
      });
    }
    return __refreshTokenDeferred.promise;
  };

  // Uses .ajax do avoid the $http interceptor
  service.logout = function () {

    var deferred = $q.defer();

    if (service.isAuthenticated()) {
      service.getAccessToken().then(function (token) {
        $.ajax({
          type: 'GET',
          url: PathConstants.BASE_URL + PathConstants.LOGOUT_PATH,
          dataType: 'json',
          headers: {"Authorization": 'Bearer ' + token},
          success: function () {
            __clear();
            $log.info("Logout success.");
            deferred.resolve();
          },
          error: function() {
            $log.error("Logout failed.");
            deferred.reject();
          }
        });
      })
    }

    return deferred.promise;
  };

  service.getAccessToken = function() {
    var deferred = $q.defer();
    if (!service.isAuthenticated()) {
      deferred.reject("The current user is not authenticated.");
    } else {
      // Check if token has expired. If we are within 5 seconds (5,000 ms) within expiration, go
      // ahead and refresh it.
      if (__getOauth().expirationTime <= new Date(new Date().getTime() + 5000)) {
        $log.info('started refreshing token');
        service.refreshToken().then(function(data){
          deferred.resolve(data.access_token);
        }).catch(function(error){
          deferred.reject(error);
        });
      } else {
        deferred.resolve(__getOauth().access_token);
      }
    }
    return deferred.promise;
  };

  return service;
});
