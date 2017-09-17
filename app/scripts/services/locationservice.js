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
    var userCredential = JSON.parse(localStorage.getItem("userDetail"));
    if(userCredential){
      var headers = {
        'Content-type': 'application/JSON',
        token: userCredential.data.token,
        client: userCredential.data.client,
        uid: userCredential.data.uid
      };
    }
    vm.addLocation = function(data){
      var deffered = $q.defer();
      var obj={
        method:'POST',
        headers : headers,
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
