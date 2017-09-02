'use strict';

/**
 * @ngdoc directive
 * @name servu.directive:pageLoader
 * @description
 * # pageLoader
 */
angular.module('servu')
  .directive('pageLoader', function () {
    return {
      templateUrl: 'views/dialogTemplates/page_loader.html',
      restrict: 'E'
    };
  });
