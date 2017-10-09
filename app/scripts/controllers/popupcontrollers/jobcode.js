'use strict';

/**
 * @ngdoc function
 * @name servu.controller:jobcodeCtrl
 * @description
 * # jobcodeCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('jobcodeCtrl',['$scope','jobListService', '$stateParams', function ($scope, jobListService, $stateParams) {
    $scope.obj={};


    $scope.startJob = function(){
      $scope.pageLoader = true;
      jobListService.jobStartCode($stateParams.id, $scope.obj).then(function(res){
        console.log(res);
        $scope.pageLoader = false;
        $scope.closeThisDialog();
      },function(err){
        console.log(err);

      })
    }

  }]);
