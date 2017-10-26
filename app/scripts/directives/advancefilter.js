'use strict';

/**
 * @ngdoc directive
 * @name servu.directive:advanceFilter
 * @description
 * # advanceFilter
 */
angular.module('servu')
  .directive('advanceFilter', function () {
    return {
        templateUrl: 'views/panels/advanceFilter.html',
        restrict: 'E'
    };
  });
