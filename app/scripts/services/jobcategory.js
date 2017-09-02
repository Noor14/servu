'use strict';

/**
 * @ngdoc service
 * @name servu.jobCategory
 * @description
 * # jobCategory
 * Service in the servu.
 */
angular.module('servu')
  .service('jobCategory',['host', '$q', '$http',
    function (host, $q, $http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var vm = this;

    vm.getjobCategory = function(){
      var deffered = $q.defer();
      var url = host + "/categories";
      $http.get(url).then(function(res){
        deffered.resolve(res);
      },function(err){
        deffered.reject(err);
      });

      return deffered.promise;
    };
    vm.categoryService = function(category){
      var deffered = $q.defer();
      var url = host + "/categories/" + category.id + "/services";
      $http.get(url).then(function(res){
        deffered.resolve(res);
      },function(err){
        deffered.reject(err);
      });

      return deffered.promise;
    }
  }]);
