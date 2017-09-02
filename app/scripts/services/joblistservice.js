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
    vm.getJobList = function(page, time){
      var deffered = $q.defer();
      var obj = {
        url :  host + "/jobs",
        method : "GET",
        headers: {'Content-type': 'application/JSON'},
        params : {
          page : page,
          timestamp: time
        }

      };
      $http(obj).then(function(res){
        deffered.resolve(res);
      });
      return deffered.promise;
    }



  }]);
