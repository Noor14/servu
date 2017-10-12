'use strict';

/**
 * @ngdoc function
 * @name servu.controller:jobComplainCtrl
 * @description
 * # jobComplainCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('jobComplainCtrl',['$scope','jobListService', '$stateParams', 'toastr', function ($scope, jobListService, $stateParams, toastr) {
    $scope.complain = {};
    $scope.createComplain = function(){
      $scope.pageLoader = true;
      jobListService.jobComplain($scope.complain, $stateParams.id).then(function(res){
        if(res.status == 201){
          $scope.pageLoader = false;
          toastr.success('Your complain has been registered against this job',{
            closeButton: true,
            preventOpenDuplicates: true
          });
          $scope.closeThisDialog();

        }
      },function(err){
        $scope.pageLoader = false;
       console.log(err);
      })
    }

      }]);
