'use strict';

/**
 * @ngdoc function
 * @name servu.controller:homeCtrl
 * @description
 * # homeCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('homeCtrl', ['$location', 'credentialService', 'toastr', '$state', '$rootScope', 'twitterService', 'ngDialog', 'socialService',
    function ($location, credentialService, toastr, $state, $rootScope, twitterService, ngDialog, socialService) {
    var vm = this;
    vm.user = {};

    vm.getClass = function (path) {
      return ($location.path() === path) ? 'active' : '';
    };

    vm.sidenav = function(display){
      $rootScope.sidemenu = display;
    };
    vm.login = function(){
      vm.loading = true;
      vm.loginCheck = false;
      credentialService.userLogin(vm.user).then(function(res){
        console.log(res);
        vm.loading = false;
        if(res.status === 200){
          if(res.data.user.phone_confirmed){
          localStorage.setItem("userDetail",JSON.stringify(res));
          $state.go("user.joblist");
          }
          else if(!res.data.user.phone_confirmed){
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
        }
        else{
          vm.loginCheck = "Username or password is incorrect";
        }

      }, function(err){
        vm.loading = false;
        console.log(err);
      })
    };


    $rootScope.$on('event:social-sign-in-success', function(event, userDetails){
      vm.userDetails = userDetails;
      if(userDetails.provider == 'facebook')
      {
        vm.token = {
          access_token: userDetails.token,
          phone: userDetails.phone
        };
        socialService.fbLogin(vm.token).then(function(res){
            if(res.status == 200){
              localStorage.setItem('userDetail', JSON.stringify(res));
              credentialService.authed = true;
              $state.go('user.joblist');

            }
          },
          function(err){
            console.log(err);
            if(err.data.type == 423 && vm.token.access_token){
              ngDialog.open({
                template: 'views/dialogTemplates/phonePopup.html',
                resolve: {
                  token: function () {
                    return {
                      access_token: vm.token.access_token,
                      provider: vm.userDetails.provider
                    };
                  }
                },
                controller: 'getPhoneCtrl'
              });
            }
          })
      }
      else if(userDetails.provider == 'google')
      {
        vm.token = {
          access_token: userDetails.idToken,
          phone: userDetails.phone

        };
        socialService.googleLogin(vm.token).then(function(res){
            if(res.status == 200){
              localStorage.setItem('userDetail', JSON.stringify(res));
              credentialService.authed = true;
              $state.go('user.joblist');

            }
          },
          function(err){
            console.log(err);
            if(err.data.type == 423 && vm.token.access_token){
              ngDialog.open({
                template: 'views/dialogTemplates/phonePopup.html',
                resolve: {
                  token: function () {
                    return {
                      access_token: vm.token.access_token,
                      provider: vm.userDetails.provider
                    };
                  }
                },
                controller: 'getPhoneCtrl'
              });
            }
          })
      }

    });
      vm.twitterLogin = function(){
        twitterService.connectTwitter().then(function(res) {
          vm.userDetails  = res;
          console.log(res,"twitter response");
          vm.token = {
            access_token: vm.userDetails.oauth_token,
            access_token_secret: vm.userDetails.oauth_token_secret,
            phone: vm.userDetails.phone
          };
          if(!vm.token.phone){
            ngDialog.open({
              template: 'views/dialogTemplates/phonePopup.html',
              resolve: {
                token: function () {
                  return {
                      access_token : vm.token,
                      provider: vm.userDetails.provider

                  };
                }
              },
              controller: 'getPhoneCtrl'
            });

          }

        });
      };






    twitterService.initialize();


  }]);
