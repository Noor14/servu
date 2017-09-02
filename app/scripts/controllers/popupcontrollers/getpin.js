'use strict';

/**
 * @ngdoc function
 * @name servu.controller:getPinCtrl
 * @description
 * # getPinCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('getPinCtrl',['$scope', 'token','socialService', 'credentialService', '$state','toastr',
    function ($scope, token, socialService, credentialService, $state, toastr) {
    $scope.socialProvider = token.provider;
    $scope.pinLogin = function () {
      $scope.token = token;
      $scope.token.pin = $scope.pin_code;
      $scope.pinEntered = true;
      $scope.pinMessage='';
      if ($scope.socialProvider == 'facebook') {
        socialService.fbLogin($scope.token).then(function (res) {
          console.log(res, 'pin');
          if (res.status == 200) {
            $scope.pinEntered = false;
            localStorage.setItem('userDetail', JSON.stringify(res));
            credentialService.authed = true;
            $scope.closeThisDialog();
            $state.go('user.joblist');

          }
          else{
            $scope.pinMessage = "Enter valid pin code"

          }
        },function(err){
          $scope.pinEntered = false;
          toastr.warning('Connection problem please try again',{
            closeButton: true,
            preventOpenDuplicates: true
          });
          console.log(err);
        });
      }
      else if ($scope.socialProvider == 'google') {
        socialService.googleLogin($scope.token).then(function (res) {
          console.log(res, 'pin');
          if (res.status == 200) {
            localStorage.setItem('userDetail', JSON.stringify(res));
            credentialService.authed = true;
            $scope.pinEntered = false;
            $scope.closeThisDialog();
            $state.go('user.joblist');

          }
          else{
            $scope.pinMessage = "Enter valid pin code"
          }
        },function(err){
          $scope.pinEntered = false;
          toastr.warning('Connection problem please try again',{
            closeButton: true,
            preventOpenDuplicates: true
          });
          console.log(err);
        });
      }
      else if ($scope.socialProvider == 'twitter') {
        socialService.twitterLogin($scope.token).then(function (res) {
          console.log(res, 'pin');
          if (res.status == 200) {
            localStorage.setItem('userDetail', JSON.stringify(res));
            credentialService.authed = true;
            $scope.pinEntered = false;
            $scope.closeThisDialog();
            $state.go('user.joblist');

          }
          else{
            $scope.pinMessage = "Enter valid pin code"
          }
        },function(err){
          $scope.pinEntered = false;
          toastr.warning('Connection problem please try again',{
            closeButton: true,
            preventOpenDuplicates: true
          });
          console.log(err);
        });
      }
    };
    $scope.resendSocial = function() {

      $scope.pinEntered = true;
      if ($scope.socialProvider == 'facebook') {

        socialService.fbLogin(token).then(function (res) {
          $scope.pinEntered = false;
          console.log(res);
        },function(err){
          $scope.pinEntered = false;
          console.log(err);
        })
      }
      else if($scope.socialProvider == 'google') {

        socialService.googleLogin(token).then(function (res) {
          $scope.pinEntered = false;
          console.log(res);
        },function(err){
          $scope.pinEntered = false;
          console.log(err);
        })
      }
      else if($scope.socialProvider == 'twitter') {

        socialService.twitterLogin(token).then(function (res) {
          $scope.pinEntered = false;
          console.log(res);
        },function(err){
          $scope.pinEntered = false;
          console.log(err);
        })
      }
    };

  }]);
