'use strict';

/**
 * @ngdoc function
 * @name servu.controller:addSkillCtrl
 * @description
 * # addSkillCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('addSkillCtrl',['$scope','$rootScope','jobCategory',  function ($scope, $rootScope, jobCategory) {
    $scope.step = 1;
    $scope.serviceId=[];
    $scope.selected_cat = function(category){
      $scope.category_title = category.title;
      $rootScope.popupLoader = true;
      jobCategory.categoryService(category).then(function(res){
        $scope.step = 4;
        $rootScope.popupLoader = false;
        $scope.services = res.data.services;
      })
    };
    $scope.navigate = function(page_no){
      $scope.step = page_no -1;
    };
    $scope.category = function(){
      $rootScope.popupLoader = true;
      jobCategory.getjobCategory().then(function(res){
        $rootScope.popupLoader = false;
        $scope.categories = res.data.categories;
      });
    };

    $scope.serviceCheck = function(id){

      if($scope.serviceId.length){
        var idx = $scope.serviceId.indexOf(id);
        if(idx  > -1){
          $scope.serviceId.splice(idx, 1);
        }
        else{
          $scope.serviceId.push(parseInt(id));
        }
      }
      else if(!$scope.serviceId.length){
        $scope.serviceId.push(parseInt(id));
      }
    };

    $scope.slectedServices = function() {
      $scope.message='';
      if ($scope.serviceId.length) {
        //$scope.$emit('userSkills', $scope.serviceId);
        $scope.closeThisDialog($scope.serviceId);
      }
      else{
        $scope.message = "Please select in any skills";
      }
    };

    $scope.category()

  }]);
