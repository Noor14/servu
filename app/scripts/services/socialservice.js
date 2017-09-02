'use strict';

/**
 * @ngdoc service
 * @name servu.socialService
 * @description
 * # socialService
 * Service in the servu.
 */
angular.module('servu')
  .service('socialService',['$http', '$q', 'host', function ($http, $q, host) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var vm = this;
    vm.fbLogin = function(token){
      var deffered = $q.defer();
      var obj={
        url: host + "/auth/facebook/callback",
        method: "POST",
        headers: {'Content-type': 'application/JSON' },
        data : token
      };
      $http(obj).then(function(res){
        deffered.resolve(res);
      },function(err){
        deffered.reject(err);
      });
      return deffered.promise;
    };
    vm.googleLogin = function(token){
      var deffered = $q.defer();
      var obj={
        url: host + "/auth/google/callback",
        method: "POST",
        headers: {'Content-type': 'application/JSON' },
        data : token
      };
      $http(obj).then(function(res){
        deffered.resolve(res);
      },function(err){
        deffered.reject(err);
      });
      return deffered.promise;
    };
    vm.twitterLogin = function(token){
      var deffered = $q.defer();
      var obj={
        url: host + "/auth/twitter/callback",
        method: "POST",
        headers: {'Content-type': 'application/JSON' },
        data : token
      };
      $http(obj).then(function(res){
        deffered.resolve(res);
      },function(err){
        deffered.reject(err);
      });
      return deffered.promise;
    }



  }]);
