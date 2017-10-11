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


    vm.getJobList = function(page, time){
      var deffered = $q.defer();
      if(header.userCredential.data.user.user_type == 1){
        var url = host + "/jobs/my_jobs";
      }
      if(header.userCredential.data.user.user_type == 2){
        var url = host + "/jobs";
      }

      var obj = {
        url : url ,
        method : "GET",
        headers: header.userAuth,
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


    }]);
