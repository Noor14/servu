'use strict';

/**
 * @ngdoc function
 * @name servu.controller:dashboardCtrl
 * @description
 * # dashboardCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('dashboardCtrl', ['$state', 'twitterService', '$rootScope', '$location', 'credentialService', 'toastr', 'socialLoginService','header',
    function ($state, twitterService, $rootScope, $location, credentialService, toastr, socialLoginService, header) {

    var vm = this;
      vm.toggle = false;


      vm.logout = function(){
      var obj = {
        token: vm.accountInfo.data.token,
        uid: vm.accountInfo.data.uid,
        client: vm.accountInfo.data.client
      };
      credentialService.userLogout(obj).then(function(res){
        console.log("res",res);
        if(res.status == 204){
          socialLoginService.logout();
          twitterService.clearCache();
          credentialService.authed = false;
          localStorage.clear();
          toastr.success('Account has been logout',{
            closeButton: true,
            preventOpenDuplicates: true
          });
          $state.go("home.login");
          header.userCredential = header.userAuth = {};

        }
      });
    };
    vm.getClass = function (path) {
      return ($location.path() === path) ? 'active' : '';
    };
      vm.filter = function(){
        vm.toggle = !vm.toggle;
        $rootScope.$broadcast('filterScope', vm.toggle);
      };
    function init(){
      vm.accountInfo = JSON.parse(localStorage.getItem("userDetail"));
      header.authorize(vm.accountInfo);
      vm.userData = vm.accountInfo.data.user;
    }
      init();


  }]);
