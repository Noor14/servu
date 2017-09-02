'use strict';

/**
 * @ngdoc function
 * @name servu.controller:ResetbypinCtrl
 * @description
 * # ResetbypinCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('ResetbypinCtrl',['$scope', 'phone_no', '$state', 'credentialService', 'toastr',
    function($scope, phone_no, $state, credentialService, toastr){
    $scope.user={};
    $scope.resetPassword = function(){
      $scope.pinEntered = true;
      $scope.pinMessage = $scope.passMessage='';
      if($scope.user.password_confirmation == $scope.user.password){
        credentialService.resetPasswordbypin($scope.user).then(function(res){
          console.log(res,'res');
          $scope.pinEntered = false;
          if(res.status == 200){
            $scope.closeThisDialog();
            toastr.success('Password updated', {
              closeButton: true,
              preventOpenDuplicates: true
            });
            $state.go("home.login");
          }
          else if(res.status == 404){
            $scope.pinMessage = "Please enter a valid pin";
          }
        },function(err){
          $scope.pinMessage = "Please enter a valid pin";
          $scope.pinEntered = false;
          console.log(err);
        })
      }
      else{
        $scope.pinEntered = false;
        $scope.passMessage = "Both password should be same"
      }
    };

    $scope.resendPin = function(){
      $scope.pinEntered = true;
      credentialService.resetPasswordbymail({email:phone_no}).then(function(res){
        $scope.pinEntered = false;
        console.log(res);
      })

    }
  }]);
