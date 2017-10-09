'use strict';

/**
 * @ngdoc function
 * @name servu.controller:jobcodeCtrl
 * @description
 * # jobcodeCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('jobcodeCtrl',['$scope','jobListService', '$stateParams', 'toastr', function ($scope, jobListService, $stateParams, toastr) {
    $scope.obj={};


    $scope.startJob = function(){
      $scope.jobError='';
      $scope.pageLoader = true;
      jobListService.jobStartCode($stateParams.id, $scope.obj).then(function(res){
        console.log(res);
        toastr.success('Your job code has been submitted successfully',{
          closeButton: true,
          preventOpenDuplicates: true
        });
        $scope.pageLoader = false;
        $scope.closeThisDialog();
      },function(err){
        console.log(err);
        $scope.pageLoader = false;
        $scope.jobError = err.data.errors[0];

      })
    }

  }]);
