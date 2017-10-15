'use strict';

/**
 * @ngdoc function
 * @name servu.controller:signupCtrl
 * @description
 * # signupCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('signupCtrl', ['credentialService', 'documentService', 'toastr', '$state', 'ngDialog',
    function (credentialService, documentService, toastr, $state, ngDialog) {
    var vm = this;
    vm.user = {};
      vm.serviceProvider = function(){
        if(vm.provider){
          vm.required = true;
        }
        else{
          vm.required = false;
          delete vm.user.company_name;
        }
      };


    vm.newAccount = function(){

      vm.emailExist = vm.phone_noExist = vm.message = false;
      vm.loading = true;


      if(vm.user.password === vm.user.password_confirmation){

        createAccount();

      }
      else{
        vm.loading = false;
        vm.message = "Password doesn't match";
      }
    };

    function signUp() {

      credentialService.userSignup(vm.user).then(function (res) {
        console.log(res.data);
        vm.loading = false;
        if (res.status === 201) {
          vm.user = {};
          ngDialog.open({
            template: 'views/dialogTemplates/pinPopup.html',
            resolve: {
              user_info: function () {
                return res.data;
              }
            },
            showClose: false,
            overlay: false,
            controller: 'confirmPinCtrl'
          });
        }
        else if (res.data.errors.length && res.status === 422) {
          vm.emailExist = res.data.errors[0];
          console.log(vm.emailExist, 'emailExist');
        }
        else if (res.data.errors.length && res.status === 409) {
          vm.phone_noExist = res.data.errors[0];
          console.log(vm.phone_noExist, 'phoneExist');
        }
      }, function (err) {
        vm.loading = false;
        console.log(err.data.errors);
      })

    }

    function createAccount(){
      if(vm.user.profile_pic){
        var pix = "data:" + vm.user.profile_pic.filetype + ";base64,"+ vm.user.profile_pic.base64;
        documentService.profileDoc({input:pix}).then(function(res){
          console.log(res,'response');
          vm.loading = false;
          if(res.status == 201){
            vm.user.profile_pic_id = res.data.id;
            signUp();

          }
        },function(err){
          vm.loading = false;
        })
      }
      else{
        signUp();
      }
    }


  }]);
