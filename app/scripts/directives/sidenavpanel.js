'use strict';

/**
 * @ngdoc directive
 * @name servu.directive:sideNavPanel
 * @description
 * # sideNavPanel
 */
angular.module('servu')
  .directive('sideNavPanel', function () {
    return {
      templateUrl: 'views/panels/sidenav.html',
      restrict: 'E'
    };
  });
