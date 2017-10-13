'use strict';

/**
 * @ngdoc function
 * @name servu.controller:JobDetailCtrl
 * @description
 * # JobDetailCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('JobDetailCtrl',['$scope', 'ngDialog', 'jobListService', 'commentService', '$state', '$rootScope', 'toastr', '$stateParams','header', 'bidService',
    function ($scope, ngDialog, jobListService, commentService, $state, $rootScope, toastr, $stateParams, header, bidService) {

    var vm = this;
    vm.activeDetailTab = 'active';
    vm.accountInfo = JSON.parse(localStorage.getItem("userDetail"));
    vm.userData = vm.accountInfo.data.user;
    if(vm.userData.user_type == 1){
      vm.tabwidth = "col-md-4 col-sm-4"
    }
    if(vm.userData.user_type == 2){
      vm.tabwidth = "col-md-6 col-sm-6"
    }
    vm.comment={};

    $scope.map = {
      center: {
        latitude: 24.774265,
        longitude: 46.738586
      },
      zoom: 14
    };
    $scope.options = {
      scrollwheel: false
    };
    $scope.marker = {
      id: 0,
      coords: {
        latitude: 24.774265,
        longitude: 46.738586
      }
    };

    vm.getJobDetail = function(){
      $rootScope.pageLoader = true;
      jobListService.jobDetail($stateParams.id).then(function(res){
        $rootScope.pageLoader = false;

        if(res.status == 200){
          console.log(res);
          vm.job = res.data;
          $scope.marker.coords.latitude = $scope.map.center.latitude = vm.job.location.latitude;
          $scope.marker.coords.longitude = $scope.map.center.longitude = vm.job.location.longitude;
        }
      },function(err){
        $rootScope.pageLoader = false;

        console.log(err)
      })
    };

    vm.deleteJob = function(id){

           ngDialog.openConfirm({
            template:'\
                <p>Are you sure you want to delete this job?</p>\
                <div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">No</button>\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Yes</button>\
                </div>',
            plain: true
          }).then(function (yes) {
             jobListService.deleteUserJob(id).then(function(res){
                  if(res.status == 204){
                    toastr.success('Job has been deleted',{
                      closeButton: true,
                      preventOpenDuplicates: true
                    });
                    $state.go('user.joblist');
                  }
             })
           }, function (no) {
             console.log('no');
           });

    };

    vm.editJob = function(job){
      vm.dialog = ngDialog.open({
        template: 'views/dialogTemplates/jobcatergoryPopup.html',
        appendClassName: 'addjobPopup',
        controller: 'EditjobCtrl',
        resolve: {
          JobDetail: function(){
            return angular.copy(job);
          }

        }

      });
      vm.dialog.closePromise.then(function (data) {
        console.log(data.id + ' has been dismissed.');
        vm.getJobDetail();


      });
    };



    vm.insertComment = function(){
      commentService.addComment($stateParams.id, vm.comment).then(function(res){
        console.log(res,'res');
        if(res.status == 201){
          vm.comment={};
          vm.getComment('', '');
        }

      },function(err){
        console.log(err)
      })
    };


    vm.getComment = function(page, time_stamp){
      vm.activeCommentTab='active';
      vm.activeBidTab='';
      vm.activeDetailTab = '';
      commentService.commentList($stateParams.id, page, time_stamp).then(function(res){
        if(res.status == 200){
          vm.userComment = res.data.comments;
        }
      },function(err){
        console.log(err);
      })
    };
    vm.editComment = function(comment){
      vm.editdialog = ngDialog.open({
        template: 'views/dialogTemplates/editjobComment.html',
        appendClassName: 'addPopup',
        controller: 'EditjobcommentCtrl',
        resolve: {
          comment: function(){
            return angular.copy(comment);
          }

        }

      });
      vm.editdialog.closePromise.then(function (data) {
        vm.getComment('', '');
      });
    };

    vm.deleteComment = function(id){
      ngDialog.openConfirm({
        template:'\
                <p>Are you sure you want to delete this comment?</p>\
                <div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">No</button>\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Yes</button>\
                </div>',
        plain: true
      }).then(function (yes) {
        commentService.deleteUserComment($stateParams.id, id).then(function(res){
          if(res.status == 204){
            toastr.success('Comment has been deleted',{
              closeButton: true,
              preventOpenDuplicates: true
            });

            vm.getComment('', '');

          }
        })
      }, function (no) {
        console.log(no,'no');
      });
    };

    vm.insertBid = function(){
     vm.biding = ngDialog.open({
        template: 'views/dialogTemplates/addBid.html',
        appendClassName: 'bidPopup',
        controller: 'bidCtrl',
        resolve:{
         bidDetail: function(){
           return vm.job
         }
       }
      });
      vm.biding.closePromise.then(function (data) {
        vm.getJobDetail();
      });

    };
      vm.viewBid = function(){
      vm.bidView = ngDialog.open({
        template: 'views/dialogTemplates/viewBid.html',
        appendClassName: 'bidPopup',
        controller: 'bidCtrl',
        resolve:{
          bidDetail: function(){
            return vm.job
          }
        }
      });
        vm.bidView.closePromise.then(function (data) {
          vm.getJobDetail();
        });
    };

   vm.acceptBid = function(bid) {
     vm.bidId = bid.id;
     vm.bidBudget = bid.budget;
     StartCheckout.open({
       amount: bid.budget + "00",
       currency: "AED"
     });
   };
   vm.getBidList = function(){
     vm.activeBidTab = 'active';
     vm.activeDetailTab = '';
     vm.activeCommentTab = '';
    bidService.getAllBid($stateParams.id, '','').then(function(res){
      console.log(res,'allbid');
      if(res.status==200){
        vm.userBid = res.data;
      }
    },function(err){
      console.log(err,'errbid');

    })
    };

      vm.JobCompleted = function(){
        jobListService.jobComplete($state.params.id).then(function(res){

          if(res.status==200){
            toastr.success('Your job has been completed',{
              closeButton: true,
              preventOpenDuplicates: true
            });
            vm.getJobDetail();
          }

        },function(err){
          console.log(err);
        })
      };

      vm.JobComplain = function(){
        vm.complain = ngDialog.open({
          template: 'views/dialogTemplates/complainJob.html',
          appendClassName: 'bidPopup',
          controller: 'jobComplainCtrl'
        });

        vm.complain.closePromise.then(function (data) {
          vm.getJobDetail();
        });
      };

      vm.jobRating = function(){
        vm.review = ngDialog.open({
          template: 'views/dialogTemplates/reviewJob.html',
          appendClassName: 'bidPopup',
          controller: 'jobReviewCtrl',
          resolve:{
            jobRating : function(){
              return ;
            }
          }
        });

        vm.review.closePromise.then(function (data) {
          vm.getJobDetail();
        });
      };
      vm.jobRatingUpdate = function(){
        vm.updateReview = ngDialog.open({
          template: 'views/dialogTemplates/reviewJob.html',
          appendClassName: 'bidPopup',
          controller: 'jobReviewCtrl',
          resolve:{
            jobRating : function(){
              return angular.copy(vm.job.review);
            }
          }
        });
        vm.updateReview.closePromise.then(function (data) {
          vm.getJobDetail();
        });
      };

      vm.jobCode = function(){
           vm.startStatus = ngDialog.open({
            template: 'views/dialogTemplates/startJob.html',
            appendClassName: 'addPopup',
            controller: 'jobcodeCtrl'
          });
        vm.startStatus.closePromise.then(function (data) {
          vm.getJobDetail();
        });
        };
      function init(){
        header.authorize(vm.accountInfo);
        vm.getJobDetail();
      }


      StartCheckout.config({
        key: "test_open_k_8a7b71440fff9ece9816",
        complete: function (params) {
          var token_details = params;
          console.log(token_details,'token_details');
          vm.payment = {
            token_name: token_details.token.id, amount: parseInt(vm.bidBudget), currency: "AED"
          };
          bidService.acceptBid(vm.payment, $state.params.id, vm.bidId).then(function(res){
          if(res.status == 200){
            toastr.success('You successfully accepted the bid',{
              closeButton: true,
              preventOpenDuplicates: true
            });
            vm.getJobDetail();
          }
          },function(err){
            toastr.warning('You do not successfully accepted the bid',{
              closeButton: true,
              preventOpenDuplicates: true
            });
          })

        }

      });


      init();
  }]);
