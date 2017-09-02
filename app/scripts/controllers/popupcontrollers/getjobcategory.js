'use strict';

/**
 * @ngdoc function
 * @name servu.controller:getjobCategoryCtrl
 * @description
 * # getjobCategoryCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('getjobCategoryCtrl',['$scope', '$rootScope', 'jobCategory', function ($scope, $rootScope, jobCategory){
    $scope.step = 1;
    $scope.category = function(){
      $rootScope.popupLoader = true;
      jobCategory.getjobCategory().then(function(res){
        console.log(res,"res");
        $rootScope.popupLoader = false;
        $scope.categories = res.data.categories;
      });
    };
    $scope.selected_cat = function(category){
      $scope.category_title = category.title;
      $rootScope.popupLoader = true;
      jobCategory.categoryService(category).then(function(res){
        $scope.step = 2;
        $rootScope.popupLoader = false;
        $scope.services = res.data.services;
        console.log(res);
      })
    };
    $scope.gotoDetail = function(service){
      $scope.step = 3;
    };
    $scope.navigate = function(page_no){
      $scope.step = page_no -1;
    };

    $scope.category()
  }]);
