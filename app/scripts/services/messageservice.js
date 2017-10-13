'use strict';

/**
 * @ngdoc service
 * @name servu.message
 * @description
 * # message
 * Service in the servu.
 */
angular.module('servu')
  .service('messageService',['$http', '$q', 'host', 'header', function ($http, $q, host, header) {
    var vm = this;


    vm.insertMessage = function(data, id){
      var deffered = $q.defer();
      var obj={
        method:'POST',
        headers : header.userAuth,
        url: host + "jobs/"+id +"/messages",
        data : data,
        params:{
          id: id
        }
      };
      $http(obj).then(function(res){
        deffered.resolve(res);
      },function(err){
        deffered.reject(err);
      });
      return deffered.promise;
      };

      vm.insertMessageCon = function(data, id){
        var deffered = $q.defer();
        var obj={
          method:'POST',
          headers : header.userAuth,
          url: host + "conversations/"+id +"/messages",
          data : data,
          params:{
            id: id
          }
        };
      $http(obj).then(function(res){
        deffered.resolve(res);
      },function(err){
        deffered.reject(err);
      });
      return deffered.promise;
    };

    vm.allMessages = function(id, page, time){
      var deffered = $q.defer();
      var obj = {
        url :  host + "/jobs/"+id+"/messages",
        method : "GET",
        headers: header.userAuth,
        params:{
          page: page,
          timestamp:time
        }

      };
      $http(obj).then(function(res){
        deffered.resolve(res);
      });
      return deffered.promise;
    };

    vm.allConversation = function(page, time){
      var deffered = $q.defer();
      var obj = {
        url :  host + "/conversations",
        method : "GET",
        headers: header.userAuth,
        params:{
          page: page,
          timestamp:time
        }

      };
      $http(obj).then(function(res){
        deffered.resolve(res);
      });
      return deffered.promise;
    };
    vm.getSpecConversation = function(id, page, time){
      var deffered = $q.defer();
      var obj = {
        url :   host + "/conversations/"+id+"/messages",
        method : "GET",
        headers: header.userAuth,
        params:{
          page: page,
          timestamp:time
        }

      };
      $http(obj).then(function(res){
        deffered.resolve(res);
      });
      return deffered.promise;
    }





  }]);
