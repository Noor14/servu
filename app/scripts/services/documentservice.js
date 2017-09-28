'use strict';

/**
 * @ngdoc service
 * @name servu.documentService
 * @description
 * # documentService
 * Service in the servu.
 */
angular.module('servu')
  .service('documentService',['host', '$http', '$q','header',
    function (host, $http, $q, header) {
      // AngularJS will instantiate a singleton by calling "new" on this function
      var vm = this;
      vm.profileDoc = function(doc){
        var deffered = $q.defer();

        var obj = {
          method: 'POST',
          url : host + "/documents",
          headers: header.userAuth,
          data : doc
        };
        $http(obj).then(function(res){
          deffered.resolve(res);
        });
        return deffered.promise;
      };

      vm.deleteDoc = function(id){
        var deffered = $q.defer();

        var obj = {
          url : host + "/documents/"+id,
          headers: header.userAuth
        };
        $http.delete(obj.url,{headers : obj.headers}).then(function(res){
          deffered.resolve(res);
        });
        return deffered.promise;
      }
    }]);
