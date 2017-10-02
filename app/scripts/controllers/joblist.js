'use strict';

/**
 * @ngdoc function
 * @name servu.controller:jobListCtrl
 * @description
 * # jobListCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('jobListCtrl',['$rootScope', 'jobListService', 'ngDialog','$state','$timeout',
    function ($rootScope, jobListService, ngDialog, $state, $timeout) {

    var vm = this;
      vm.accountInfo = JSON.parse(localStorage.getItem("userDetail"));
      vm.userData = vm.accountInfo.data.user;

      vm.jobsCard = "col-lg-4";

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

      vm.getStatus = function(job){
         var status= vm.status.find(function(obj){
           return obj.id === job.status;
        });

        job.statusName = status.name;
        return status.name;
      };
      $rootScope.$on('filterScope', function(events, args){
        vm.showfilter = args;
        if(vm.showfilter){
          vm.jobContent = "col-md-9 fadeInLeft";
          vm.jobsCard = "col-lg-6";
          vm.filterContainer = "fadeInDown";

        }
        else{
          vm.filterContainer = "fadeInUp";
          $timeout(function(){
            vm.jobContent="fadeInRight";
            vm.jobsCard = "col-lg-4"

          },1000)


        }

      });


    vm.current_time;
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
        vm.jobTime = res.data.timestamp;
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
        appendClassName: 'addPopup',
        controller: 'getjobCategoryCtrl'
      });
      vm.dialog.closePromise.then(function (data) {
        console.log(data.id + ' has been dismissed.');
        vm.getJobs('', '');


      });
    };

        vm.getJobs('', '');

  }]);
