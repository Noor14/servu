'use strict';

/**
 * @ngdoc function
 * @name servu.controller:acceptBidCtrl
 * @description
 * # acceptBidCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('acceptBidCtrl',['$scope','bidDetail', function ($scope, bidDetail) {
    console.log('bidDetail', bidDetail);
  }]);
