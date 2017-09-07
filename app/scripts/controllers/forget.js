'use strict';

/**
 * @ngdoc function
 * @name servu.controller:forgetCtrl
 * @description
 * # forgetCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('forgetCtrl', ['$state', 'credentialService', 'toastr', 'ngDialog',
    function ($state, credentialService, toastr, ngDialog) {
    var vm = this;
    vm.user = {};
    vm.forgetPassword = function() {
      vm.message = '';
      vm.loading = true;
      if (vm.user.email.length == 12 && !isNaN(parseInt(vm.user.email))) {
        credentialService.resetPasswordbymail(vm.user).then(function (res) {
          console.log(res);
          vm.loading = false;
          if(res.status == 201) {
            ngDialog.open({
              template: 'views/dialogTemplates/resetByPin.html',
              resolve: {
                phone_no: function () {
                  return vm.user.email;
                }
              },
              showClose: false,
              controller: 'ResetbypinCtrl'
            });
          }
          else if(res.status == 404){
            vm.message = "User not found please enter a valid credential";
          }
        },function (err) {
          vm.loading = false;
          console.log(err);
        })
      }
      else {

        credentialService.resetPasswordbymail(vm.user).then(function (res) {
          console.log(res);
          vm.loading = false;
          if (res.status === 201) {
            toastr.success('Check your email address', {
              closeButton: true,
              preventOpenDuplicates: true
            });
            $state.go("home.login");
          }
          else if(res.status == 404){
            vm.message = "User not found please enter a valid credential";
          }
          else {
            vm.message = "Try after some time"
          }
        }, function (err) {
          vm.loading = false;
          console.log(err);
        })
      }
    };



  }]);
