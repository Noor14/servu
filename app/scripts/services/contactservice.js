'use strict';

/**
 * @ngdoc service
 * @name servu.contactService
 * @description
 * # contactService
 * Service in the servu.
 */
angular.module('servu')
  .service('contactService',['host','$http','$q', function (host, $http, $q) {

    var vm = this;

    vm.contact = function(data){
      var deffered = $q.defer();
      var obj = {
        url :  host + "/contact_us",
        method : "POST",
        data : data
      };
      $http(obj).then(function(res){
        deffered.resolve(res);
      });
      return deffered.promise;
    };
  }]);
