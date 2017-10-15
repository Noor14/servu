'use strict';

/**
 * @ngdoc service
 * @name servu.profileService
 * @description
 * # profileService
 * Service in the servu.
 */
angular.module('servu')
  .service('profileService',['$http', '$q', 'host', 'header', function ($http, $q, host, header) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var vm = this;
    vm.getProfile = function(id){
      var deffered = $q.defer();
      var obj = {
        url :  host + "/users/"+id,
        method : "GET",
        headers: header.userAuth
      };
      $http(obj).then(function(res){
        deffered.resolve(res);
      });
      return deffered.promise;
    };
    vm.getReview = function(id, page, time){
      var deffered = $q.defer();
      var obj = {
        url :  host + "/users/"+id+"/reviews",
        method : "GET",
        headers: header.userAuth,
        params:{
          page: page,
          timestamp: time
        }
      };
      $http(obj).then(function(res){
        deffered.resolve(res);
      });
      return deffered.promise;
    }
  }]);
