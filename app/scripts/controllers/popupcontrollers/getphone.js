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

      var provider= token.provider;

      var obj = {
        access_token  : token.access_token,
        phone : $scope.phone
      };


      if(provider == 'facebook'){
        socialService.fbLogin(obj).then(function (res){
        if(res.status == 200){
          if(res.data.user.phone_confirmed){
          localStorage.setItem('userDetail', JSON.stringify(res));
          credentialService.authed = true;
          $state.go('user.joblist');
          }
          else if(!res.data.user.phone_confirmed){
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

        }
        }, function (err) {
          if (err.data.type == 424) {
            $scope.closeThisDialog();
            ngDialog.open({
              template: 'views/dialogTemplates/pinPopup.html',
              resolve: {
                token: function () {
                  return {
                    access_token:obj.access_token,
                    phone:obj.access_token,
                    provider: provider
                  }
                }
              },
              showClose:false,
              overlay: false,
              controller: 'getPinCtrl'
            });
          }
        })

      }
      else if(provider == 'google'){
        socialService.googleLogin(obj).then(function (res) {
          if(res.status == 200){
            if(res.data.user.phone_confirmed){
              localStorage.setItem('userDetail', JSON.stringify(res));
              credentialService.authed = true;
              $state.go('user.joblist');
            }
            else if(!res.data.user.phone_confirmed){
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

          }
        }, function (err) {
          if (err.data.type == 424) {
            $scope.closeThisDialog();
            ngDialog.open({
              template: 'views/dialogTemplates/pinPopup.html',
              resolve: {
                token: function () {
                  return {
                    access_token:obj.access_token,
                    phone:obj.access_token,
                    provider: provider
                  }
                }
              },
              showClose:false,
              overlay: false,
              controller: 'getPinCtrl'

            });
          }
        })
      }
      else if(provider == 'twitter'){

        socialService.twitterLogin(obj).then(function (res) {
          console.log($scope.phone, 'phone');
          if(res.status == 200){
            if(res.data.user.phone_confirmed){
              localStorage.setItem('userDetail', JSON.stringify(res));
              credentialService.authed = true;
              $state.go('user.joblist');
            }
            else if(!res.data.user.phone_confirmed){
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

          }
        }, function (err) {
          if (err.data.type == 424) {
            $scope.closeThisDialog();
            ngDialog.open({
              template: 'views/dialogTemplates/pinPopup.html',
              resolve: {
                token: function () {
                  return {
                    access_token:obj.access_token,
                    phone:obj.access_token,
                    provider: provider
                  }
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
