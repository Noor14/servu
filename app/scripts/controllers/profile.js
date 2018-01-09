'use strict';

/**
 * @ngdoc function
 * @name servu.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('ProfileCtrl',['profileService','$rootScope', 'ngDialog', '$state', function (profileService, $rootScope, ngDialog, $state) {
    var vm = this;
    vm.current_time;
    vm.currentReview_time;
    vm.reviewLoader = false;
    vm.JobLoader = false;
    vm.reviews=[];
    vm.userJob=[];
    localStorage.removeItem('jobId');
    localStorage.removeItem('conversation_id');
    localStorage.removeItem('notify_conversation_id');
    vm.accountInfo = JSON.parse(localStorage.getItem("userDetail"));
    vm.userData = vm.accountInfo.data.user;
    vm.status = [
      {
        id:0,
        name:"Rejected by Admin"
      },
      {
        id:1,
        name:"In Process"
      },
      {
        id:2,
        name:"Awarded"
      },
      {
        id:3,
        name:"Started"
      },
      {
        id:4,
        name:"Completed"
      },
      {
        id:5,
        name:"In Dispute"
      },
      {
        id:6,
        name:"Signed Off"
      }

    ];

    vm.getStatus = function(job) {
      var status = vm.status.find(function (obj) {
        return obj.id === job.status;
      });
      job.statusName = status.name;
      return status.name;
    };

    if(vm.userData.user_type == 1){
      vm.tabwidth = "col-md-12 col-sm-12 active";
      vm.activeTabThree = 'active'

    }
    if(vm.userData.user_type == 2){
      vm.tabwidth = "col-md-4 col-sm-4";
      vm.activeTabOne = 'active'

    }
    vm.getUserProfile = function(){
      $rootScope.pageLoader = true;
      profileService.getProfile(vm.userData.id).then(function(res){
        if(res.status==200){
          $rootScope.pageLoader = false;
          vm.profile = res.data;
            if(vm.profile.user_type == 2){
            vm.getUserReview(vm.userData.id,'', '');
          }
          vm.getJobs('', '');
        }
      },function(err){
        $rootScope.pageLoader = false;
        console.log(err);
      })
    };
    vm.getUserReview = function(id, page, time){
      if(vm.reviewLoader) return;
      vm.reviewLoader = true;
      profileService.getReview(id, page, time).then(function(res){

        if(res.status==200){
           angular.forEach(res.data.reviews, function(obj){
             vm.reviews.push(obj);
           });
          vm.totalreviewPages = res.data.total_pages;
          vm.page_no =  res.data.page;
          if(!vm.currentReview_time){
            vm.currentReview_time = res.data.timestamp;
          }
          vm.reviewLoader = false;

            }

      },function(err){
        vm.reviewLoader = false;
        console.log(err);
      })
    };
    vm.getJobs = function(page, time){
      if(vm.JobLoader) return;
      vm.JobLoader = true;
      profileService.userJobs(page, time).then(function(res){
        if(res.status == 200){
          if(vm.jobQeue){
            if(vm.userJob.length && res.data.page == 1){
              vm.userJob = [];
            } 
        angular.forEach(res.data.jobs, function(obj){
             vm.userJob.push(obj);
           });
          }
          else{
            vm.userJob = res.data.jobs;
          }
         if(!vm.current_time){
          vm.current_time = res.data.timestamp;
        }
        vm.totalJobPages = res.data.total_pages;
        vm.jobpage_no =  res.data.page;
        vm.JobLoader = false;
      }

      },function(err){
        vm.JobLoader = false;
        console.log(err);
      });
    };
    vm.jobDetail = function(jobid){
      $state.go("user.jobDetail",{id: jobid});
    };
    vm.editProfile = function(){
      vm.profileBox = ngDialog.open({
        template: 'views/dialogTemplates/editProfile.html',
        appendClassName: 'addjobPopup',
        controller: 'editProfileCtrl'
      });
      vm.profileBox.closePromise.then(function (data) {
        vm.getUserProfile();
      });
    };


     vm.loadReview = function(){

       if(vm.page_no < vm.totalreviewPages){
         vm.page_no += 1;
         vm.getUserReview(vm.userData.id, vm.page_no, vm.currentReview_time);

         }
     };
     vm.loadJobs = function(){

      if(vm.jobpage_no < vm.totalJobPages){
         vm.jobpage_no += 1;
         vm.jobQeue = true;
         vm.getJobs(vm.jobpage_no, vm.current_time);

         }
     };
    vm.getUserProfile();
  }]);
