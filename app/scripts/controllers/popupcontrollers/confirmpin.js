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
            user_info.user.phone_confirmed = true;
            //vm.user = {};
            if((user_info.user.user_type == 1 && (!user_info.user.hasOwnProperty('company_name') || !user_info.user.company_name)) || (user_info.user.user_type == 2 && user_info.user.hasOwnProperty('company_name') && user_info.user.company_name)){
              credentialService.authed = true;
              localStorage.setItem("userDetail",JSON.stringify({data: user_info}));
              toastr.success('Your account has been created',{
                closeButton: true,
                preventOpenDuplicates: true
              });
              $scope.closeThisDialog();
              credentialService.authed = true;
              $state.go("user.joblist");
            }
            else if(user_info.user.user_type == 1 && user_info.user.hasOwnProperty('company_name') && user_info.user.company_name){
              toastr.success('Your account has been created',{
                closeButton: true,
                preventOpenDuplicates: true
              });
              $state.go('home.login');
              $scope.closeThisDialog();

            }
            else{
            toastr.warning('Invalid login credential',{
              closeButton: true
            });
              $scope.closeThisDialog();

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
