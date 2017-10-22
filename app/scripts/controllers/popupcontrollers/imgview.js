'use strict';

/**
 * @ngdoc function
 * @name servu.controller:imgViewCtrl
 * @description
 * # imgViewCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('imgViewCtrl',['$scope','imageUrl', function ($scope, imageUrl) {
    $scope.url = imageUrl;
  }]);
