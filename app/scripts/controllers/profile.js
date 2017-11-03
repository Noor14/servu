'use strict';

/**
 * @ngdoc function
 * @name servu.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('ProfileCtrl',['profileService','$rootScope', 'jobListService','ngDialog', '$state', function (profileService, $rootScope, jobListService, ngDialog, $state) {
    var vm = this;
    vm.current_time;
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
            vm.getJobs('', '');
            vm.getUserReview(vm.userData.id,'', '');
          }
          else if(vm.profile.user_type == 1){
            vm.getJobs('', '');
          }
        }
      },function(err){
        $rootScope.pageLoader = false;
        console.log(err);
      })
    };
    vm.getUserReview = function(id, page, time){
      vm.reviewLoader = true;
      profileService.getReview(id, page, time).then(function(res){

        if(res.status==200){
          vm.reviewLoader = false;
          vm.reviews = res.data.reviews;
          // angular.forEach(res.data.reviews, function(obj){
          //   vm.reviews.push(obj);
          // });
          vm.page_no =  res.data.page;
          if(!vm.current_time){
            vm.current_time = res.data.timestamp;
          }
            }

      },function(err){
        vm.reviewLoader = false;
        console.log(err);
      })
    };
    vm.getJobs = function(page, time){
      vm.JobLoader = true;
      (!vm.query)?undefined:vm.query;
      jobListService.getmyJobs(vm.query, page, time).then(function(res){
        vm.JobLoader = false;
        if(!vm.current_time){
          vm.current_time = res.data.timestamp;
        }
        vm.userJob = res.data.jobs;

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


    // vm.loadReview= function(){
    //  vm.page_no += 1;
    //   vm.getUserReview(vm.userData.id, vm.page_no, vm.current_time);
    // };
    vm.getUserProfile();
  }]);
