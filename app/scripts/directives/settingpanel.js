'use strict';

/**
 * @ngdoc directive
 * @name servu.directive:settingPanel
 * @description
 * # settingPanel
 */
angular.module('servu')
  .directive('settingPanel', function () {
    return {
      templateUrl: 'views/panels/settingpanel.html',
      restrict: 'E'
    };
  });
