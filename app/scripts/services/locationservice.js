'use strict';

/**
 * @ngdoc service
 * @name servu.locationService
 * @description
 * # locationService
 * Service in the servu.
 */
angular.module('servu')
  .service('locationService',['$http', '$q', 'host', function ($http, $q ,host) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var vm = this;
    vm.addLocation = function(data){
      var deffered = $q.defer();
      var obj={
        method:'POST',
        headers : {contentType: 'application/JSON'},
        url: host + "/locations",
        data : data
      };

      $http(obj).then(function(res){
        deffered.resolve(res);
      },function(err){
        deffered.reject(err);
      })
      return deffered.promise;
    }
  }]);
