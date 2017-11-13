'use strict';

/**
 * @ngdoc function
 * @name servu.controller:dashboardCtrl
 * @description
 * # dashboardCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('dashboardCtrl', ['$scope', '$state', 'jobListService','twitterService', '$rootScope', '$location', 'credentialService', 'toastr', 'socialLoginService','header','profileService',
    function ($scope, $state, jobListService, twitterService, $rootScope, $location, credentialService, toastr, socialLoginService, header, profileService) {

      var vm = this;
      vm.toggle = false;
      vm.set_notify={};
      vm.set_email={};
      $rootScope.$on('profileChange', function(event, arg){
        if(arg){
          vm.userData.profile_pic = arg.profile_pic;
          vm.userData.name = arg.name;

        }
      });
      vm.sidemenu = function(event, display){
        if(display == 'display'){
          event.stopPropagation();
          event.preventDefault();
        }
        $rootScope.sidemenuHome = display;
      };
      vm.settingBox = function(){
      if($rootScope.displayToggle =='setting-close'){
        if(vm.size <768){
          $rootScope.sidemenuHome = 'display-not';
        }
        $rootScope.displayToggle = "setting-open";
        $rootScope.notifyToggle = "setting-close";
        vm.loadSetting = true;
        profileService.getSetting().then(function(res){
          vm.loadSetting = false;
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
        $rootScope.displayToggle ='setting-close';
        vm.loadSetting = false;

      }
      };
      $rootScope.$on('size',function(arg){
        vm.size = arg.targetScope.windowWidth;
        if(vm.size >= 768){
          vm.chatbox = vm.convlist = 'con-display';
        }


      });
      vm.notifyBox = function(page, time){
        if($rootScope.notifyToggle =='setting-close'){
          if(vm.size <768){
            $rootScope.sidemenuHome = 'display-not';
          }
          $rootScope.notifyToggle = "setting-open";
          $rootScope.displayToggle = 'setting-close';
          vm.loadSetting = true;
          profileService.getNotification(page, time).then(function(res){
            vm.loadSetting = false;
            if(res.status == 200){
                  vm.notifications = res.data.notifications;

            }
          }, function(err){
            console.log(err);
          })
        }
        else if($rootScope.notifyToggle == "setting-open"){
          $rootScope.notifyToggle ='setting-close';
          vm.loadSetting = false;

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
          jobListService.allJobFilter = {};
          jobListService.myJobFilter = {};
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
      $scope.$watch('vm.searchjob', function(newValue, oldValue){
        if(newValue != undefined){
      $rootScope.$broadcast('searchFilter', newValue);
        }
    });
      vm.updateSetting = function(){
        vm.obj = {};
        vm.loadSetting = true;
        updateFeature();
        profileService.updateSetting(vm.obj).then(function(res){
          if(res.status == 200){
            vm.loadSetting = false;
            $rootScope.displayToggle ='setting-close';
            toastr.success("Update user setting");
          }
        },function(err){
          console.log(err);
          vm.loadSetting = false;
        })
      };
      vm.filter = function(){
        vm.toggle = !vm.toggle;
        $rootScope.$broadcast('filterScope', vm.toggle);
      };
      $rootScope.$on('filterbtn', function(event, arg){
        vm.toggle=arg;
      });


      vm.notifyDetail = function(obj){
        if(obj.notification_type < 11 && (obj.notification_type != 7 || obj.notification_type != 8)){
        $state.go('user.jobDetail', {id: obj.resource_id});
          $rootScope.notifyToggle ='setting-close';
        }
        if(obj.notification_type ==7){
          $state.go('user.profile');
          $rootScope.notifyToggle ='setting-close';
        }
        if(obj.notification_type ==8){
          localStorage.setItem('notify_conversation_id', obj.resource_id);
          $state.go('user.message');
        }
      };

      function init(){
      vm.accountInfo = JSON.parse(localStorage.getItem("userDetail"));
      header.authorize(vm.accountInfo);
      vm.id = vm.accountInfo.data.user.id;
      getProfile()
    }
      function updateFeature(){
        if(vm.set_email.jobStatus && vm.set_notify.jobStatus){
          vm.obj.job_status = 0
        }
        if(vm.set_email.jobStatus && !vm.set_notify.jobStatus){
          vm.obj.job_status = 1
        }
        if(!vm.set_email.jobStatus && vm.set_notify.jobStatus){
          vm.obj.job_status = 2
        }
        if(!vm.set_email.jobStatus && !vm.set_notify.jobStatus){
          vm.obj.job_status = 3
        }
        if(vm.set_email.related_jobs && vm.set_notify.related_jobs){
          vm.obj.related_jobs = 0
        }
        if(vm.set_email.related_jobs && !vm.set_notify.related_jobs){
          vm.obj.related_jobs = 1
        }
        if(!vm.set_email.related_jobs && vm.set_notify.related_jobs){
          vm.obj.related_jobs = 2
        }
        if(!vm.set_email.related_jobs && !vm.set_notify.related_jobs){
          vm.obj.related_jobs = 3
        }
        if(vm.set_email.new_review && vm.set_notify.new_review){
          vm.obj.new_review = 0
        }
        if(vm.set_email.new_review && !vm.set_notify.new_review){
          vm.obj.new_review = 1
        }
        if(!vm.set_email.new_review && vm.set_notify.new_review){
          vm.obj.new_review = 2
        }
        if(!vm.set_email.new_review && !vm.set_notify.new_review){
          vm.obj.new_review = 3
        }
        if(vm.set_email.new_message && vm.set_notify.new_message){
          vm.obj.new_message = 0
        }
        if(vm.set_email.new_message && !vm.set_notify.new_message){
          vm.obj.new_message = 1
        }
        if(!vm.set_email.new_message && vm.set_notify.new_message){
          vm.obj.new_message = 2
        }
        if(!vm.set_email.new_message && !vm.set_notify.new_message){
          vm.obj.new_message = 3
        }
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
