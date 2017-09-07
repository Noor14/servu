'use strict';

/**
 * @ngdoc function
 * @name servu.controller:dashboardCtrl
 * @description
 * # dashboardCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('dashboardCtrl', ['$state', 'twitterService', '$rootScope', '$location', 'credentialService', 'toastr', 'socialLoginService',
    function ($state, twitterService, $rootScope, $location, credentialService, toastr, socialLoginService) {

    var vm = this;
      vm.accountInfo = JSON.parse(localStorage.getItem("userDetail"));
      vm.logout = function(){
      $rootScope.navLoader = true;
      var obj = {
        token: vm.accountInfo.data.token,
        uid: vm.accountInfo.data.uid,
        client: vm.accountInfo.data.client
      };
      credentialService.userLogout(obj).then(function(res){
        console.log("res",res);
        $rootScope.navLoader = false;
        if(res.status == 204){
          socialLoginService.logout();
          localStorage.clear();
          twitterService.clearCache();
          credentialService.authed = false;
          toastr.success('Account has been logout',{
            closeButton: true,
            preventOpenDuplicates: true
          });
          $state.go("home.login");
        }
      });
    };
    vm.getClass = function (path) {
      return ($location.path() === path) ? 'active' : '';
    };



  }]);
