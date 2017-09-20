'use strict';

/**
 * @ngdoc service
 * @name servu.jobListService
 * @description
 * # jobListService
 * Service in the servu.
 */
angular.module('servu')
  .service('jobListService',['$http', '$q', 'host',
    function ($http, $q, host) {
    var vm = this;
      var userCredential = JSON.parse(localStorage.getItem("userDetail"));
      if(userCredential){
      var headers = {
        'Content-type': 'application/JSON',
        token: userCredential.data.token,
        client: userCredential.data.client,
        uid: userCredential.data.uid
      };
      }
    vm.getJobList = function(page, time){
      var deffered = $q.defer();
      var obj = {
        url :  host + "/jobs/my_jobs",
        method : "GET",
        headers: headers,
        params : {
          page : page,
          timestamp: time
        }

      };
      $http(obj).then(function(res){
        deffered.resolve(res);
      });
      return deffered.promise;
    };

      vm.addJob = function(data){
        var deffered = $q.defer();
        var obj = {
          url :  host + "/jobs",
          method : "POST",
          headers: headers,
          data : data
        };
        $http(obj).then(function(res){
          deffered.resolve(res);
        });
        return deffered.promise;
      };

      vm.updateUserJob = function(data){
        var deffered = $q.defer();
        var obj = {
          url :  host + "/jobs/"+data.id,
          method : "PUT",
          headers: headers,
          data : data
        };
        $http(obj).then(function(res){
          deffered.resolve(res);
        });
        return deffered.promise;
      };

      vm.jobDetail = function(id){
        var deffered = $q.defer();
        var obj = {
          url :  host + "/jobs/"+id,
          method : "GET"
        };
        $http(obj).then(function(res){
          deffered.resolve(res);
        });
        return deffered.promise;
      };

      vm.deleteUserJob = function(id){
        var deffered = $q.defer();
        var obj = {
          url :  host + "/jobs/"+id,
          headers: headers
        };
        $http.delete(obj.url, {headers: obj.headers}).then(function(res){
          deffered.resolve(res);
        });
        return deffered.promise;
      }



  }]);
