'use strict';

/**
 * @ngdoc service
 * @name servu.jobListService
 * @description
 * # jobListService
 * Service in the servu.
 */
angular.module('servu')
  .service('jobListService',['$http', '$q', 'host','header',
    function ($http, $q, host ,header) {
    var vm = this;
      vm.allJobFilter = {};
      vm.myJobFilter = {};

    vm.getmyJobs = function(query, status, page, time){

        vm.myJobFilter.page = page;
        vm.myJobFilter.time = time;
        vm.myJobFilter.status = status;
      var deffered = $q.defer();
      var obj = {
        url : host + "/jobs/my_jobs",
        method : "GET",
        headers: header.userAuth,
        params : {
          page : vm.myJobFilter.page,
          timestamp: vm.myJobFilter.time,
          query:query,
          status: vm.myJobFilter.status
        }

      };
      $http(obj).then(function(res){
        deffered.resolve(res);
      });
      return deffered.promise;
    };
      vm.allJobs = function(query, page, time, filter){
        vm.allJobFilter = filter;
        if(filter.hasOwnProperty('time') && filter.time){
        vm.allJobFilter.page = page;
        vm.allJobFilter.time = filter.time;
        }
        else if(!filter.hasOwnProperty('time') || !filter.time){
          vm.allJobFilter.page = page;
          vm.allJobFilter.time = time;
        }
        var deffered = $q.defer();
        var obj = {
          url : host + "/jobs",
          method : "GET",
          headers: header.userAuth,
          params : {
            page : vm.allJobFilter.page,
            timestamp: vm.allJobFilter.time,
            query: query,
            distance: vm.allJobFilter.distance,
            lat:vm.allJobFilter.lat,
            long:vm.allJobFilter.long,
            budget_min: vm.allJobFilter.budget_min,
            budget_max: vm.allJobFilter.budget_max,
            category_ids: JSON.stringify(vm.allJobFilter.category_ids),
            sort_by: vm.allJobFilter.sort_by
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
          headers: header.userAuth,
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
          headers: header.userAuth,
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
          method : "GET",
          headers: header.userAuth

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
          headers: header.userAuth
        };
        $http.delete(obj.url, {headers: obj.headers}).then(function(res){
          deffered.resolve(res);
        });
        return deffered.promise;
      };
      vm.jobStartCode = function(jobId, obj){
        var deffered = $q.defer();
        var obj = {
          url: host+'/jobs/'+jobId+'/start',
          method:'PUT',
          headers:header.userAuth,
          data:obj
        };
        $http(obj).then(function(res){
          deffered.resolve(res)
        },function(err){
          deffered.reject(err)
        });
        return deffered.promise;
      };
      vm.jobComplete = function(jobId){
        var deffered = $q.defer();
        var obj = {
          url: host+'/jobs/'+jobId+'/complete',
          method:'PUT',
          headers:header.userAuth,
          params:{
           id :  jobId
          }
        };
        $http(obj).then(function(res){
          deffered.resolve(res)
        },function(err){
          deffered.reject(err)
        });
        return deffered.promise;
      };

      vm.jobComplain = function(obj, jobId){
        var deffered = $q.defer();
        var obj = {
          url: host+'/jobs/'+jobId+'/complaint',
          method:'POST',
          headers:header.userAuth,
          data:obj,
          params:{
            id :  jobId
          }
        };
        $http(obj).then(function(res){
          deffered.resolve(res)
        },function(err){
          deffered.reject(err)
        });
        return deffered.promise;
      };

      vm.jobRating = function(obj, jobId){
        var deffered = $q.defer();
        var obj = {
          url: host+'/jobs/'+jobId+'/reviews',
          method:'POST',
          headers:header.userAuth,
          data:obj,
          params:{
            id :  jobId
          }
        };
        $http(obj).then(function(res){
          deffered.resolve(res)
        },function(err){
          deffered.reject(err)
        });
        return deffered.promise;
      };
      vm.jobRatingUpdate = function(obj, jobId){
        var deffered = $q.defer();
        var obj = {
          url: host+'/jobs/'+jobId+'/reviews',
          method:'PUT',
          headers:header.userAuth,
          data:obj,
          params:{
            id :  jobId
          }
        };
        $http(obj).then(function(res){
          deffered.resolve(res)
        },function(err){
          deffered.reject(err)
        });
        return deffered.promise;
      };


    }]);
