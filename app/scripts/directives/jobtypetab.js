'use strict';

/**
 * @ngdoc directive
 * @name servu.directive:jobTypeTab
 * @description
 * # jobTypeTab
 */
angular.module('servu')
  .directive('jobTypeTab', function () {
    return {
      templateUrl: 'views/categoryTemplates/jobscheduleTab.html',
      restrict: 'E'

    };
  });
