'use strict';

/**
 * @ngdoc function
 * @name servu.controller:homeCtrl
 * @description
 * # homeCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('homeCtrl', ['$scope', '$location', 'credentialService', 'toastr', '$state', '$rootScope', 'twitterService', 'ngDialog', 'socialService',
    function ($scope, $location, credentialService, toastr, $state, $rootScope, twitterService, ngDialog, socialService) {
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
            if(res.data.user.user_type < 3){
              credentialService.authed = true;
              localStorage.setItem("userDetail",JSON.stringify(res));
              $state.go("user.joblist");
            }
            else{
              toastr.warning('Invalid login credential',{
                closeButton: true
              });
            }
          }
          else if(!res.data.user.phone_confirmed){
            credentialService.resendPin(res.data).then(function(response){
              vm.loading = false;
              vm.user = {};
              ngDialog.open({
                template: 'views/dialogTemplates/pinPopup.html',
                resolve: {
                  user_info: function () {
                    return res.data;
                  }
                },
                showClose: false,
                controller: 'confirmPinCtrl'
              });
            });

          }
        }
        else if(res.status == 401){
          var toast_message = res.data.errors[0];
          toastr.warning(toast_message,{
            closeButton: true
          });
        }
        else{
          vm.loginCheck = "Username or password is incorrect";
        }

      }, function(err){
        vm.loading = false;
        console.log(err);
      })
    };


    $scope.$on('event:social-sign-in-success', function(event, userDetails){
      vm.userDetails = userDetails;
      if(userDetails.provider == 'facebook')
      {
        vm.token = {
          access_token: userDetails.token,
          phone: userDetails.phone
        };
        socialService.fbLogin(vm.token).then(function(res){
            if(res.status === 200){
              if(res.data.user.phone_confirmed){
                credentialService.authed = true;
                localStorage.setItem("userDetail",JSON.stringify(res));
                $state.go("user.joblist");
              }
              else if(!res.data.user.phone_confirmed){
                credentialService.resendPin(res.data).then(function(response){
                  ngDialog.open({
                    template: 'views/dialogTemplates/pinPopup.html',
                    resolve: {
                      user_info: function () {
                        return res.data;
                      }
                    },
                    showClose: false,
                    controller: 'confirmPinCtrl'
                  });
                });

              }
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
            if(res.status === 200){
              if(res.data.user.phone_confirmed){
                credentialService.authed = true;
                localStorage.setItem("userDetail",JSON.stringify(res));
                $state.go("user.joblist");
              }
              else if(!res.data.user.phone_confirmed){
                credentialService.resendPin(res.data).then(function(response){
                  ngDialog.open({
                    template: 'views/dialogTemplates/pinPopup.html',
                    resolve: {
                      user_info: function () {
                        return res.data;
                      }
                    },
                    showClose: false,
                    controller: 'confirmPinCtrl'
                  });
                });

              }
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
