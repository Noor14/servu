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
      vm.toggle = false;
    vm.accountInfo = JSON.parse(localStorage.getItem("userDetail"));
    vm.userData = vm.accountInfo.data.user;

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
          localStorage.clear();
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
      vm.filter = function(){
        vm.toggle = !vm.toggle;
        $rootScope.$broadcast('filterScope', vm.toggle);
      }



  }]);
