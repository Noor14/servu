'use strict';

/**
 * @ngdoc function
 * @name servu.controller:getPhoneCtrl
 * @description
 * # getPhoneCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('getPhoneCtrl',['$scope', 'token', 'ngDialog', 'socialService', 'credentialService', function ($scope, token, ngDialog, socialService, credentialService){
    $scope.loginSubmit = function(){

      var obj = {
        access_token  : token.access_token,
        provider: token.provider,
        phone : $scope.phone
      };


      if(obj.provider == 'facebook'){
        socialService.fbLogin(obj).then(function (res){
        if(res.status == 200){
          if(res.data.user.phone_confirmed){
            localStorage.setItem('userDetail', JSON.stringify(res));
            credentialService.authed = true;
            $state.go('user.joblist');
          }
          else if(!res.data.user.phone_confirmed){
            ngDialog.open({
              template: 'views/dialogTemplates/pinPopup.html',
              resolve: {
                token: function () {
                  return obj;

                }
              },
              showClose:false,
              overlay: false,
              controller: 'getPinCtrl'
            });
          }
        }
        }, function (err) {
          if (err.data.type == 424) {
            $scope.closeThisDialog();
            ngDialog.open({
              template: 'views/dialogTemplates/pinPopup.html',
              resolve: {
                token: function () {
                  return obj;
                }
              },
              showClose:false,
              overlay: false,
              controller: 'getPinCtrl'
            });
          }
        })

      }
      else if(obj.provider == 'google'){
        socialService.googleLogin(obj).then(function (res) {
          if(res.status == 200){
            if(res.data.user.phone_confirmed){
              localStorage.setItem('userDetail', JSON.stringify(res));
              credentialService.authed = true;
              $state.go('user.joblist');
            }
            else if(!res.data.user.phone_confirmed){
              ngDialog.open({
                template: 'views/dialogTemplates/pinPopup.html',
                resolve: {
                  token: function () {
                    return obj;

                  }
                },
                showClose:false,
                overlay: false,
                controller: 'getPinCtrl'
              });
            }

          }
        }, function (err) {
          if (err.data.type == 424) {
            ngDialog.open({
              template: 'views/dialogTemplates/pinPopup.html',
              resolve: {
                token: function () {
                  return obj;
                }
              },
              showClose:false,
              overlay: false,
              controller: 'getPinCtrl'

            });
          }
        })
      }
      else if(obj.provider == 'twitter'){
        obj = token.access_token;
        obj.phone = $scope.phone;
        obj.provider = token.provider;
        socialService.twitterLogin(obj).then(function (res) {
          console.log($scope.phone, 'phone');
          if (res.status == 200) {
            if(res.data.user.phone_confirmed){
              localStorage.setItem('userDetail', JSON.stringify(res));
              credentialService.authed = true;
              $state.go('user.joblist');
            }
            else if(!res.data.user.phone_confirmed){
              ngDialog.open({
                template: 'views/dialogTemplates/pinPopup.html',
                resolve: {
                  token: function () {
                    return obj;
                  }
                },
                showClose:false,
                overlay: false,
                controller: 'getPinCtrl'
              });
            }

          }
        }, function (err) {
          if (err.data.type == 424) {
            $scope.closeThisDialog();
            ngDialog.open({
              template: 'views/dialogTemplates/pinPopup.html',
              resolve: {
                token: function () {
                  return obj;
                }
              },
              showClose:false,
              overlay: false,
              controller: 'getPinCtrl'
            });
          }
        })

      }



    }
  }]);
