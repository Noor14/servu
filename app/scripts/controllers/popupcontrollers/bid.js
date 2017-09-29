'use strict';

/**
 * @ngdoc function
 * @name servu.controller:bidCtrl
 * @description
 * # bidCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('bidCtrl',['$scope','bidService','toastr','$stateParams', function ($scope, bidService, toastr, $stateParams) {

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
    }
  }]);
