'use strict';

/**
 * @ngdoc function
 * @name servu.controller:jobListCtrl
 * @description
 * # jobListCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('jobListCtrl',['$rootScope', 'jobListService', 'ngDialog',
    function ($rootScope, jobListService, ngDialog) {

    var vm = this;
    vm.current_time;
    var time_stamp = new Date();
    vm.getJobs = function(page, time){
      $rootScope.pageLoader = true;
      $rootScope.fullHeight = 'full-height';
      jobListService.getJobList(page, time).then(function(res){
        //console.log("res",res.data.jobs);
        $rootScope.pageLoader = false;
        $rootScope.fullHeight = '';
        if(!vm.current_time){
          vm.current_time = res.data.timestamp;
        }
        vm.pages = new Array(res.data.total_pages);
        vm.page_no =  res.data.page;
        vm.total_pages = res.data.total_pages;
        vm.jobs = res.data.jobs;
      });
    };
    vm.navigate = function(page, time, disabled){
      if(disabled == 'true'){
        vm.getJobs(page, time);
      }
    };



    vm.addJob = function(){

      ngDialog.open({
        template: 'views/dialogTemplates/jobcatergoryPopup.html',
        appendClassName: 'addjobPopup',
        controller: 'getjobCategoryCtrl'
      });

    };



    vm.getJobs(1, time_stamp);
  }]);
