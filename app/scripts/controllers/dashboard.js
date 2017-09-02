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
    vm.logout = function(){
      $rootScope.navLoader = true;
      vm.accountInfo = JSON.parse(localStorage.getItem("userDetail"));
      credentialService.userLogout(vm.accountInfo.data).then(function(res){
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
