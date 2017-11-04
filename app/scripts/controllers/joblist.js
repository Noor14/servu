'use strict';

/**
 * @ngdoc function
 * @name servu.controller:jobListCtrl
 * @description
 * # jobListCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('jobListCtrl',['$scope','$timeout', '$rootScope', 'jobListService', 'jobCategory', 'ngDialog','$state',
    function ($scope, $timeout, $rootScope, jobListService, jobCategory, ngDialog, $state) {

      var vm = this;
      vm.current_time;
      localStorage.removeItem('jobId');
      localStorage.removeItem('conversation_id');
      localStorage.removeItem('notify_conversation_id');
      vm.accountInfo = JSON.parse(localStorage.getItem("userDetail"));
      vm.userData = vm.accountInfo.data.user;
      vm.jobsCard = "col-lg-4";
      vm.jobHeading = 'My Jobs';
      vm.categoryId = [];
      vm.filterObject = {};
      vm.toggle = true;
      vm.slider = {
        minValue: 10,
        maxValue: 4000,
        options: {
          floor: 0,
          ceil: 5000,
          step: 1,
          noSwitching: true
        }
      };
      vm.distance = {
        value: 10,
        options: {
          floor: 0,
          ceil: 1000,
          step: 1
        }
      };

      vm.refreshSlider = function () {
        $timeout(function(){
          $scope.$broadcast('rzSliderForceRender');
        });
      };
      vm.refreshSlider();
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
        if (status.name != "In Process" && (vm.userData.id == job.user.id || (job.accepted_bid && job.accepted_bid.user.id == vm.userData.id)))  {
        job.statusName = status.name;
        return status.name;
        }
        else if(status.name == "In Process") {
          job.statusName = status.name;
          return status.name;
        }

      };
      function category(){
        vm.filterLoader = true;
        jobCategory.getjobCategory().then(function(res){
          vm.filterLoader = false;
          vm.filterCat = res.data.categories;
        });
      }
      $rootScope.$on('filterScope', function(events, args){
         vm.showfilter = args;
        $rootScope.filterArrow = args.toString();
        if(vm.showfilter){
          vm.jobContent = "col-md-9 fadeInLeft";
          vm.jobsCard = "col-lg-6";
          if(vm.userData.user_type==2){
            category();
          }
        }
        else{
            vm.jobContent="fadeInRight";
            vm.jobsCard = "col-lg-4"
          }

      });

      $rootScope.$on('searchFilter', function(events, args){
        vm.query = args;
        if(vm.toggle){
        vm.getJobs('', '');
        }
        else if(!vm.toggle){
          vm.getallJob('','');
        }
      });

      vm.filteration = function(status){
        console.log(status,"status");
        vm.showfilter = false;
        $scope.$emit('filterScope', vm.showfilter);
        $rootScope.$emit('filterbtn', vm.showfilter);
        if(status){
        vm.jobStatus = Number(status);
        }
        else{
          vm.jobStatus = status;

        }
        vm.getJobs('','')
      };



      vm.cat_Filter = function(id){

        if(vm.categoryId.length){
          var idx = vm.categoryId.indexOf(id);
        if(idx  > -1){
          vm.categoryId.splice(idx, 1);
        }
          else{
          vm.categoryId.push(parseInt(id));
        }
        }
       else if(!vm.categoryId.length){
        vm.categoryId.push(parseInt(id));
        }
      };
      vm.sorting = function(sortOrder){
        vm.filterObject.sort_by = parseInt(sortOrder);
      };


      vm.advancesearch = function(){
        if(isNaN(vm.slider.minValue)){
          vm.filterObject.budget_min = Number(vm.slider.minValue);
        }
        if(isNaN(vm.slider.maxValue)){
          vm.filterObject.budget_max = Number(vm.slider.maxValue);
        }
        if(isNaN(vm.distance.value)){
          vm.filterObject.distance = Number(vm.distance.value);
        }
        if(vm.categoryId.length){
          vm.filterObject.category_ids = vm.categoryId;
        }
        vm.getallJob('', '');
        vm.showfilter = false;
        $scope.$emit('filterScope', vm.showfilter);
        $rootScope.$emit('filterbtn', vm.showfilter);
      };


    vm.getJobs = function(page, time){
      $rootScope.pageLoader = true;
      $rootScope.fullHeight = 'full-height';
      (!vm.query)?undefined:vm.query;
      (!vm.jobStatus)?undefined:vm.jobStatus;
      jobListService.getmyJobs(vm.query, vm.jobStatus, page, time).then(function(res){
        console.log("res",res.data.jobs);
        if(!vm.current_time){
          vm.current_time = res.data.timestamp;
        }
        vm.pages = new Array(res.data.total_pages);
        vm.page_no =  res.data.page;
        vm.total_pages = res.data.total_pages;
        vm.records = res.data.total_records;
        vm.jobTime = res.data.timestamp;
        vm.jobs = res.data.jobs;
        vm.toggle = true;
        vm.jobHeading = 'My Jobs';
        $rootScope.fullHeight = '';
        $rootScope.pageLoader = false;

      });
    };

      vm.getallJob = function(page, time){
        $rootScope.pageLoader = true;
        $rootScope.fullHeight = 'full-height';
        (!vm.query)?'':vm.query;
        jobListService.allJobs(vm.query, page, time, vm.filterObject).then(function(res){
          console.log("res",res.data.jobs);
          if(!vm.current_time){
            vm.current_time = res.data.timestamp;
          }
          vm.pages = new Array(res.data.total_pages);
          vm.page_no =  res.data.page;
          vm.total_pages = res.data.total_pages;
          vm.records = res.data.total_records;
          vm.jobTime = res.data.timestamp;
          vm.jobs = res.data.jobs;
          vm.jobHeading = 'All Jobs';
          vm.sort = $rootScope.fullHeight = '';
          vm.filterObject = {};
          vm.categoryId=[];
          $rootScope.pageLoader = vm.toggle = false;

        });
      };

    vm.navigate = function(page, time, disabled){
      if(vm.toggle){
      if(disabled == 'true'){
        vm.getJobs(page, time);
      }
      }
      if(!vm.toggle){
        if(disabled == 'true'){
          vm.getallJob(page, time);
        }
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
