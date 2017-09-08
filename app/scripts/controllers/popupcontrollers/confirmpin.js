'use strict';

/**
 * @ngdoc function
 * @name servu.controller:confirmPinCtrl
 * @description
 * # confirmPinCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('confirmPinCtrl',['$scope', 'user_info', 'credentialService', 'toastr', '$state',
    function($scope, user_info, credentialService, toastr, $state){
      $scope.pinLogin = function(){
        $scope.pinEntered = true;
        $scope.pinMessage='';
        user_info.pin_code = $scope.pin_code;
        credentialService.phoneConfirm(user_info).then(function(response){
          if(response.status == 200){
            credentialService.authed = true;
            $scope.pinEntered = false;
            localStorage.setItem("userDetail",JSON.stringify(response.config));
            localStorage.removeItem('userInfo');
            $scope.closeThisDialog();
            //vm.user = {};
            toastr.success('Your account has been created',{
              closeButton: true,
              preventOpenDuplicates: true
            });
            $state.go("user.joblist");
          }
          else{
            $scope.pinEntered = false;
            $scope.pinMessage = "Enter valid pin code"
          }
        });
      };

      $scope.resendPin = function(){
        $scope.pinEntered = true;
        credentialService.resendPin(user_info).then(function(res){
          $scope.pinEntered = false;
          console.log(res);
        })

      }


    }]);
