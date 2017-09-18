'use strict';

/**
 * @ngdoc function
 * @name servu.controller:jobListCtrl
 * @description
 * # jobListCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('jobListCtrl',['$rootScope', 'jobListService', 'ngDialog','$state',
    function ($rootScope, jobListService, ngDialog, $state) {

    var vm = this;
    vm.accountInfo = JSON.parse(localStorage.getItem("userDetail"));
    vm.userData = vm.accountInfo.data.user;
    vm.current_time;
    var time_stamp = new Date();
    vm.getJobs = function(page, time){
      $rootScope.pageLoader = true;
      $rootScope.fullHeight = 'full-height';
      jobListService.getJobList(page, time).then(function(res){
        console.log("res",res.data.jobs);
        $rootScope.pageLoader = false;
        $rootScope.fullHeight = '';
        if(!vm.current_time){
          vm.current_time = res.data.timestamp;
        }
        vm.pages = new Array(res.data.total_pages);
        vm.page_no =  res.data.page;
        vm.total_pages = res.data.total_pages;
        vm.records = res.data.total_records;
        vm.jobs = res.data.jobs;
      });
    };
    vm.navigate = function(page, time, disabled){
      if(disabled == 'true'){
        vm.getJobs(page, time);
      }
    };


    vm.jobDetail = function(jobid){
      $state.go("user.jobDetail",{id: jobid});
    };
    vm.addJob = function(){
      vm.dialog = ngDialog.open({
        template: 'views/dialogTemplates/jobcatergoryPopup.html',
        appendClassName: 'addjobPopup',
        controller: 'getjobCategoryCtrl'
      });
      vm.dialog.closePromise.then(function (data) {
        console.log(data.id + ' has been dismissed.');
        vm.getJobs(1, time_stamp);

      });
    };


    vm.getJobs(1, time_stamp);
  }]);
