'use strict';

/**
 * @ngdoc function
 * @name servu.controller:dashboardCtrl
 * @description
 * # dashboardCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('dashboardCtrl', ['$state', 'twitterService', '$rootScope', '$location', 'credentialService', 'toastr', 'socialLoginService','header','profileService',
    function ($state, twitterService, $rootScope, $location, credentialService, toastr, socialLoginService, header, profileService) {

      var vm = this;
      vm.toggle = false;
      vm.set_notify={};
      vm.set_email={};
      vm.sidemenu = function(event, display){
        if(display == 'display'){
          event.stopPropagation();
          event.preventDefault();
        }
        $rootScope.sidemenuHome = display;
      };

      vm.settingBox = function(){

      if($rootScope.displayToggle =='setting-close'){
        $rootScope.displayToggle = "setting-open";
        profileService.getSetting().then(function(res){
          if(res.status == 200){
            if(!res.data.job_status || res.data.job_status == 1){
               vm.set_email.jobStatus = true;
            }
            if(!res.data.related_jobs || res.data.related_jobs == 1){
              vm.set_email.related_jobs = true;
            }
            if(!res.data.new_review || res.data.new_review == 1){
            vm.set_email.new_review = true;
            }
            if(!res.data.new_message || res.data.new_message == 1){
              vm.set_email.new_message = true;
            }
             if(!res.data.new_message || res.data.new_message == 2){
              vm.set_notify.new_message = true;
            }
             if(!res.data.related_jobs || res.data.related_jobs == 2){
              vm.set_notify.related_jobs = true;
            }
             if(!res.data.new_review || res.data.new_review == 2){
              vm.set_notify.new_review = true;
            }
             if(!res.data.job_status || res.data.job_status == 2){
              vm.set_notify.jobStatus = true;
            }

          }
        }, function(err){
          console.log(err);
        })
        }
        else if($rootScope.displayToggle == "setting-open"){
        $rootScope.displayToggle ='setting-close'
        }
      };

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

      vm.search = function(arg){
      $rootScope.$broadcast('searchFilter', arg);
      };

      $rootScope.$on('picChange', function(event, arg){
        if(arg){
          vm.userData.profile_pic = arg;
        }
      });

      vm.filter = function(){
        vm.toggle = !vm.toggle;
        $rootScope.$broadcast('filterScope', vm.toggle);
      };
    function init(){
      vm.accountInfo = JSON.parse(localStorage.getItem("userDetail"));
      header.authorize(vm.accountInfo);
      vm.id = vm.accountInfo.data.user.id;
      getProfile()
    }
      function getProfile(){
        profileService.getProfile(vm.id).then(function(res){
          if(res.status == 200){
            vm.userData = res.data;
          }
        })
      }
      init();


  }]);
