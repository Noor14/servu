'use strict';

/**
 * @ngdoc function
 * @name servu.controller:jobReviewCtrl
 * @description
 * # jobReviewCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('jobReviewCtrl',['$scope', 'jobListService', 'toastr', '$stateParams', function ($scope, jobListService, toastr, $stateParams) {
    $scope.review = {};
    $scope.createReview = function(){
      jobListService.jobRating($scope.review, $stateParams.id).then(function(res){
        if(res.status==201){
          toastr.success('Your job review successfully submitted',{
            closeButton: true,
            preventOpenDuplicates: true
          });
          $scope.closeThisDialog();

        }
      },function(err){
        console.log(err)
      })
    }
  }]);
