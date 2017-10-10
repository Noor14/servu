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
      jobListService.jobComplain($scope.complain, $stateParams.id).then(function(res){
        if(res.status == 201){
          toastr.success('Your complain has been registered against this job',{
            closeButton: true,
            preventOpenDuplicates: true
          });
          $scope.closeThisDialog();

        }
      },function(err){
       console.log(err);
      })
    }

      }]);
