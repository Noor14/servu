'use strict';

/**
 * @ngdoc directive
 * @name servu.directive:filterPanel
 * @description
 * # filterPanel
 */
angular.module('servu')
  .directive('filterPanel', function () {
    return {
      templateUrl: 'views/panels/filterpanel.html',
      restrict: 'E'
    };
  });
