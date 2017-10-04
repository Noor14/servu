'use strict';

/**
 * @ngdoc service
 * @name servu.bidService
 * @description
 * # bidService
 * Service in the servu.
 */
angular.module('servu')
  .service('bidService', ['$http', '$q', 'host','header',
    function ($http, $q, host, header) {
      var vm = this;

      vm.addBid = function(jobId,obj){
        var deffered = $q.defer();
        var obj = {
          url: host+'/jobs/'+jobId+'/bids',
          method:'POST',
          headers:header.userAuth,
          data: obj,
          params:{
            job_id:jobId
          }
        };
        $http(obj).then(function(res){
          deffered.resolve(res)
        },function(err){
          deffered.reject(err)
        });
        return deffered.promise;
      };
      vm.acceptBid = function(){
        var deffered = $q.defer();
        var obj = {
          url: host+'/jobs/'+jobId+'/bids/'+id+'/accept',
          method:'PUT',
          headers:header.userAuth,
          params:{
            job_id:jobId,
            id:id
          }
        };
        $http(obj).then(function(res){
          deffered.resolve(res)
        },function(err){
          deffered.reject(err)
        })
        return deffered.promise;
      };
      vm.getBid = function(){
        var deffered = $q.defer();
        var obj = {
          url: host+'/jobs/'+jobId+'/bids/'+id,
          method:'GET',
          headers:header.userAuth,
          params:{
            job_id : jobId,
            id : id
          }
        };
        $http(obj).then(function(res){
          deffered.resolve(res)
        },function(err){
          deffered.reject(err)
        });
        return deffered.promise;
      };
      vm.getAllBid = function(jobId, page, timestamp){
        var deffered = $q.defer();
        var obj = {
          url: host+'/jobs/'+jobId+'/bids',
          method:'GET',
          headers:header.userAuth,
          params:{
            job_id : jobId,
            page: page,
            timestamp : timestamp
          }
        };
        $http(obj).then(function(res){
          deffered.resolve(res)
        },function(err){
          deffered.reject(err)
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
      vm.deleteBid = function(){
        var deffered = $q.defer();
        var obj = {
          url: host+'/jobs/'+jobId+'/bids/'+id,
          method:'DELETE',
          headers:header.userAuth,
          params:{
            job_id : jobId,
            id : id
          }
        };
        $http(obj).then(function(res){
          deffered.resolve(res)
        },function(err){
          deffered.reject(err)
        });
        return deffered.promise;
      };

      // AngularJS will instantiate a singleton by calling "new" on this function
  }]);
