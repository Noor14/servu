'use strict';

/**
 * @ngdoc service
 * @name servu.documentService
 * @description
 * # documentService
 * Service in the servu.
 */
angular.module('servu')
  .service('documentService',['host', '$http', '$q',
    function (host, $http, $q) {
      // AngularJS will instantiate a singleton by calling "new" on this function
      var vm = this;
      var userCredential = JSON.parse(localStorage.getItem("userDetail"));
      if (userCredential) {
      var headers = {
        'Content-type': 'application/JSON',
        token: userCredential.data.token,
        client: userCredential.data.client,
        uid: userCredential.data.uid
      };
    }
      vm.profileDoc = function(doc){
        var deffered = $q.defer();

        var obj = {
          method: 'POST',
          url : host + "/documents",
          headers: headers,
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
          headers: headers
        };
        $http.delete(obj.url,{headers : obj.headers}).then(function(res){
          deffered.resolve(res);
        });
        return deffered.promise;
      }
    }]);
