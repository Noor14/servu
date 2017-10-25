'use strict';

/**
 * @ngdoc directive
 * @name servu.directive:notificationPanel
 * @description
 * # notificationPanel
 */
angular.module('servu')
  .directive('notificationPanel', function () {
    return {
      templateUrl: 'views/panels/notificationpanel.html',
      restrict: 'E'
    };
  });
