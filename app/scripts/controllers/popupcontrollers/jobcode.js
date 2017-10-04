'use strict';

/**
 * @ngdoc function
 * @name servu.controller:jobcodeCtrl
 * @description
 * # jobcodeCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('jobcodeCtrl',['$scope','bidService', '$stateParams', function ($scope, bidService, $stateParams) {
    $scope.obj={};


    $scope.startJob = function(){
      $scope.pageLoader = true;
      bidService.jobStartCode($stateParams.id, $scope.obj).then(function(res){
        console.log(res);
        $scope.pageLoader = false;
        $scope.closeThisDialog();
      },function(err){
        console.log(err);

      })
    }

  }]);
