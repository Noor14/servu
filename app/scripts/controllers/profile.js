'use strict';

/**
 * @ngdoc function
 * @name servu.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('ProfileCtrl',['profileService','$rootScope', function (profileService, $rootScope) {
    var vm = this;
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
      vm.tabwidth = "col-md-12 col-sm-12 active"
    }
    if(vm.userData.user_type == 2){
      vm.tabwidth = "col-md-4 col-sm-4"
    }
    vm.getUserProfile = function(){
      $rootScope.pageLoader = true;
      profileService.getProfile(vm.userData.id).then(function(res){
        if(res.status==200){
          $rootScope.pageLoader = false;
          vm.profile = res.data;
          vm.getUserReview(vm.userData.id,'', '');
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
        }

      },function(err){
        vm.reviewLoader = false;
        console.log(err);
      })
    };
    vm.getUserProfile();
  }]);