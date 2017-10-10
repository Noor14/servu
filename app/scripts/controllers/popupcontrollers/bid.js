'use strict';

/**
 * @ngdoc function
 * @name servu.controller:bidCtrl
 * @description
 * # bidCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('bidCtrl',['$scope','bidService','toastr','$stateParams','bidDetail', 'ngDialog', function ($scope, bidService, toastr, $stateParams, bidDetail, ngDialog) {
    if(bidDetail && bidDetail.my_bid){
      $scope.job = bidDetail;
      $scope.job.my_bid.created_at = moment(new Date(bidDetail.my_bid.created_at)).format('LLLL');
      $scope.bidTitle = "View Bid";
      $scope.readOnly = true;
    }
    $scope.obj={};
    $scope.bidPlace = function(){
      bidService.addBid($stateParams.id, $scope.obj).then(function(res){
        if(res.status == 201){
          $scope.closeThisDialog();
          toastr.success('Your bid has been placed successfully',{
            closeButton: true,
            preventOpenDuplicates: true
          });
        }
      })
    };

    $scope.deleteBid = function(){
      ngDialog.openConfirm({
        template:'\
                <p>Are you sure you want to delete this bid?</p>\
                <div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">No</button>\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Yes</button>\
                </div>',
        plain: true
      }).then(function (yes) {
        bidService.deleteBid($stateParams.id, $scope.job.my_bid.id).then(function(res){
          if(res.status == 204){
            toastr.success('Your bid has been deleted',{
              closeButton: true,
              preventOpenDuplicates: true
            });
            $scope.closeThisDialog();
          }
        })
      }, function (no) {
        console.log(no,'no');
      });
    };

    $scope.updateBidConfirm = function(){
      ngDialog.openConfirm({
        template:'\
                <p>Are you sure you want to update this bid?</p>\
                <div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">No</button>\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Yes</button>\
                </div>',
        plain: true
      }).then(function (yes) {
        $scope.bidTitle = "Update Bid";
        $scope.readOnly = false;

      }, function (no) {
        console.log(no,'no');
      });
    };

    $scope.updateBid = function(){
      bidService.bidUpdate($stateParams.id, $scope.job.my_bid.id, $scope.job.my_bid).then(function(res){
        if(res.status == 200){
          toastr.success('Your bid has been updated',{
            closeButton: true,
            preventOpenDuplicates: true
          });
          $scope.closeThisDialog();
        }

      },function(err){

      })
    }


  }]);
