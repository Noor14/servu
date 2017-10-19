'use strict';

/**
 * @ngdoc service
 * @name servu.locationService
 * @description
 * # locationService
 * Service in the servu.
 */
angular.module('servu')
  .service('locationService',['$http', '$q', 'host', 'header', function ($http, $q ,host, header) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var vm = this;
    vm.addLocation = function(data){
      var deffered = $q.defer();
      var obj={
        method:'POST',
        headers : header.userAuth,
        url: host + "/locations",
        data : data
      };

      $http(obj).then(function(res){
        deffered.resolve(res);
      },function(err){
        deffered.reject(err);
      });
      return deffered.promise;
    };

    vm.updateLocation = function(id, data){
      var deffered = $q.defer();
      var obj={
        method:'PUT',
        headers : header.userAuth,
        url: host + "/locations/"+id,
        data : data
      };

      $http(obj).then(function(res){
        deffered.resolve(res);
      },function(err){
        deffered.reject(err);
      });
      return deffered.promise;
    };
    vm.searchCity = function(cityName){
      var deffered = $q.defer();
      var obj={
        method:'GET',
        headers : {'Content-type': 'application/JSON'},
        url: host + "/countries/512/cities/search",
        params: {q: cityName}
      };

      $http(obj).then(function(res){
        deffered.resolve(res);
      },function(err){
        deffered.reject(err);
      });
      return deffered.promise;
    }
  }]);
