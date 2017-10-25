'use strict';

/**
 * @ngdoc function
 * @name servu.controller:myJobCtrl
 * @description
 * # myJobCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('myJobCtrl',['$rootScope', 'jobListService', 'ngDialog', '$state',
    function ($rootScope, jobListService, ngDialog, $state) {

      var vm = this;
      vm.current_time;

      localStorage.removeItem('jobId');
      localStorage.removeItem('conversation_id');
      vm.accountInfo = JSON.parse(localStorage.getItem("userDetail"));
      vm.userData = vm.accountInfo.data.user;
      vm.jobHeading = 'My Jobs';
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
        if (status.name != "In Process" && (vm.userData.id == job.user.id || job.accepted_bid.user.id == vm.userData.id))  {
          job.statusName = status.name;
          return status.name;
        }
        else if(status.name == "In Process") {
          job.statusName = status.name;
          return status.name;
        }
      };
      $rootScope.$on('filterScope', function(events, args){
        vm.showfilter = args;
        $rootScope.filterArrow = args.toString();
        if(vm.showfilter){
          vm.jobContent = "col-md-9 fadeInLeft";
          vm.jobsCard = "col-lg-6";
          vm.filterContainer = "fadeInDown";

        }
        else{
          vm.filterContainer = "fadeInUp";
          vm.jobContent="fadeInRight";
          vm.jobsCard = "col-lg-4"
        }

      });
      $rootScope.$on('searchFilter', function(events, args){
        vm.filter = args;
      });



      vm.getJobs = function(page, time){
        $rootScope.pageLoader = true;
        $rootScope.fullHeight = 'full-height';
        jobListService.myJobs(page, time).then(function(res){
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


      vm.getJobs('', '');

    }]);

