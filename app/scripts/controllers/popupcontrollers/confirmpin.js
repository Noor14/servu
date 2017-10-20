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
            $scope.pinEntered = false;
            credentialService.authed = true;
            user_info.user.phone_confirmed = true;
            $scope.closeThisDialog();
            //vm.user = {};
            if(user_info.user.user_type < 3){
              credentialService.authed = true;
              localStorage.setItem("userDetail",JSON.stringify({data: user_info}));
              toastr.success('Your account has been created',{
                closeButton: true,
                preventOpenDuplicates: true
              });
              $state.go("user.joblist");
            }
            else{
            toastr.warning('Invalid login credential',{
              closeButton: true
            });
            }
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
