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

    vm.profileDoc = function(doc){
      var deffered = $q.defer();

      var obj = {
        method: 'POST',
        url : host + "/documents",
        headers: {contentType:'application/JSON'},
        data : doc
      };
      $http(obj).then(function(res){
        deffered.resolve(res);
      });
      return deffered.promise;
    }
  }]);
