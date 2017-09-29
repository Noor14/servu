'use strict';

/**
 * @ngdoc service
 * @name servu.commentService
 * @description
 * # commentService
 * Service in the servu.
 */
angular.module('servu')
  .service('commentService',['$http', '$q', 'host','header',
    function ($http, $q, host, header) {

      var vm = this;


      vm.addComment = function(id, data){
        var deffered = $q.defer();
        var obj = {
          url : host + '/jobs/'+ id + '/comments',
          method: 'POST',
          headers: header.userAuth,
          data: data
        };
        $http(obj).then(function(res){
            console.log(res);
          deffered.resolve(res);
        },function(err){
          deffered.reject(err);
        });
        return deffered.promise;
      };
      vm.commentList = function(id, page, time){
        var deffered = $q.defer();
        var obj = {
          url : host + '/jobs/'+ id + '/comments',
          method: 'GET',
          headers: {contentType:'application/JSON'},
          params: {
            page : page,
            timestamp: time
          }
        };
        $http(obj).then(function(res){
          console.log(res);
          deffered.resolve(res);
        },function(err){
          deffered.reject(err);
        });
        return deffered.promise
      };
      vm.commentUpdate = function(obj){
        var deffered = $q.defer();
        var obj = {
          url: host + '/jobs/' + obj.job_id + '/comments/' + obj.id,
          method: 'PUT',
          headers: header.userAuth,
          data: obj,
          params: {
            job_id: obj.job_id,
            id: obj.id
          }
        };
        $http(obj).then(function(res){
          console.log(res);
          deffered.resolve(res);
        },function(err){
          deffered.reject(err);
        });
        return deffered.promise;
      };
      vm.deleteUserComment = function(jobId, id){
        var deffered = $q.defer();
        var obj = {
          url : host + '/jobs/'+ jobId + '/comments/' + id ,
          headers: header.userAuth,
          params: {
            job_id : jobId,
            id : id
          }
        };
        $http.delete(obj.url, {headers: obj.headers}).then(function(res){
          console.log(res);
          deffered.resolve(res);
        },function(err){
          deffered.reject(err);
        });
        return deffered.promise
      }
  }]);
