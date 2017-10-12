'use strict';

/**
 * @ngdoc function
 * @name servu.controller:jobReviewCtrl
 * @description
 * # jobReviewCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('jobReviewCtrl',['$scope', 'jobListService', 'toastr', '$stateParams', 'jobRating', function ($scope, jobListService, toastr, $stateParams, jobRating) {

    $scope.review = {};
    $scope.reviewTitle = "Review Services";
        if(jobRating){
          $scope.btn = jobRating.stars;
          $scope.review.stars = jobRating.stars;
          $scope.review.rating = jobRating.rating;
          $scope.reviewTitle = "Update Review Services"
        }
    $scope.createReview = function(){
      $scope.pageLoader = true;
      jobListService.jobRating($scope.review, $stateParams.id).then(function(res){
        if(res.status==201){
          $scope.pageLoader = false;
          toastr.success('Your job review successfully submitted',{
            closeButton: true,
            preventOpenDuplicates: true
          });
          $scope.closeThisDialog();

        }
      },function(err){
        $scope.pageLoader = false;
        console.log(err)
      })
    };
    $scope.updateReview = function(){
      $scope.pageLoader = true;
      jobListService.jobRatingUpdate($scope.review, $stateParams.id).then(function(res){
        if(res.status == 200){
          $scope.pageLoader = false;
          toastr.success('Your job review successfully updated',{
            closeButton: true,
            preventOpenDuplicates: true
          });
          $scope.closeThisDialog();

        }
      },function(err){
        $scope.pageLoader = false;
        console.log(err)
      })
    }
  }]);
