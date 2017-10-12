'use strict';

/**
 * @ngdoc function
 * @name servu.controller:EditjobcommentCtrl
 * @description
 * # EditjobcommentCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('EditjobcommentCtrl',['$scope', 'comment', 'commentService', 'toastr', function ($scope, comment, commentService, toastr) {
    $scope.obj = {};
    $scope.obj.body = comment.body;
    $scope.obj.id = comment.id;
    $scope.obj.job_id = comment.job_id;

        $scope.updateComment = function(){
        $scope.pageLoader = true;
        commentService.commentUpdate($scope.obj).then(function(res){
          if(res.status == 200){
            $scope.pageLoader = false;
            $scope.closeThisDialog();
            toastr.success('Comment has been updated',{
              closeButton: true,
              preventOpenDuplicates: true
            });
          }

        },function(err){
          $scope.pageLoader = false;
          console.log(err)
        })
      }
  }]);
