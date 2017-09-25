'use strict';

/**
 * @ngdoc service
 * @name servu.commentService
 * @description
 * # commentService
 * Service in the servu.
 */
angular.module('servu')
  .service('commentService',['$http', '$q', 'host',
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


      vm.addComment = function(id, data){
        var deffered = $q.defer();
        var obj = {
          url : host + '/jobs/'+ id + '/comments',
          method: 'POST',
          headers: headers,
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
          url : host + '/jobs/'+ obj.job_id + '/comments/' + obj.id ,
          method: 'PUT',
          headers: headers,
          body: obj.body

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
          headers: headers,
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
