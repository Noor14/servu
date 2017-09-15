'use strict';

/**
 * @ngdoc function
 * @name servu.controller:getjobCategoryCtrl
 * @description
 * # getjobCategoryCtrl
 * Controller of the servu
 */
var $gs;
angular.module('servu')
  .controller('getjobCategoryCtrl',['$scope', '$rootScope', 'toastr', 'jobCategory', 'locationService','documentService', 'jobListService', 'ngDialog', 'uiGmapGoogleMapApi', 'uiGmapIsReady','$timeout,',
    function ($scope, $rootScope, toastr, jobCategory, locationService, documentService, jobListService, $timeout){

      $gs = $scope;
    $scope.job = {};
    $scope.step = 1;
      $scope.map = {
        center: {
          latitude: 56.162939,
          longitude: 10.203921
        },
        zoom: 14
      };
      $scope.options = {
        scrollwheel: false
      };
      $scope.coordsUpdates = 0;
      $scope.dynamicMoveCtr = 0;
      $scope.marker = {
        id: 0,
        coords: {
          latitude: 56.162939,
          longitude: 10.203921
        },
        options: {
          draggable: true
        },
        events: {
          dragend: function(marker, eventName, args) {
            var lat = marker.getPosition().lat();
            var lon = marker.getPosition().lng();
            console.log.log(lat);
            console.log.log(lon);

            $scope.marker.options = {
              draggable: true,
              labelContent: "",
              labelAnchor: "100 0",
              labelClass: "marker-labels"
            };
          }
        }
      };
      $scope.$watchCollection("marker.coords", function(newVal, oldVal) {
        $scope.map.center.latitude = $scope.marker.coords.latitude;
        $scope.map.center.longitude = $scope.marker.coords.longitude;
        if (_.isEqual(newVal, oldVal))
          return;
        $scope.coordsUpdates++;
      });
      $timeout(function() {
        $scope.marker.coords = {
          latitude: 56.162939,
          longitude: 10.203921
        };
        $scope.dynamicMoveCtr++;
        $timeout(function() {
          $scope.marker.coords = {
            latitude: 56.162939,
            longitude: 10.203921
          };
          $scope.dynamicMoveCtr++;
        }, 2000);
      }, 1000);



      // map area above

      $scope.category = function(){
      $rootScope.popupLoader = true;
      jobCategory.getjobCategory().then(function(res){
        $rootScope.popupLoader = false;
        $scope.categories = res.data.categories;
      });
    };


    $scope.selected_cat = function(category){
      $scope.category_title = category.title;
      $rootScope.popupLoader = true;
      jobCategory.categoryService(category).then(function(res){
        $scope.step = 2;
        $rootScope.popupLoader = false;
        $scope.job.category_id = category.id;
        $scope.services = res.data.services;
      })
    };

    $scope.gotoDetail = function(service){
      console.log(service,"service");
      $scope.job.service_id = service.id;
      $scope.step = 3;
    };


    $scope.navigate = function(page_no){
      $scope.step = page_no -1;
    };



      $scope.$watch('job', function(){
        getLocation();

      });

    $scope.createJob = function(){
      if($scope.job.location_id){
        if($scope.job.photo){
          addJobPhoto();
        }
        else{
          addJobInfo();
        }
      }
    };


    function getLocation(){
      locationService.addLocation().then(function(res){
        console.log(res);
        if(res.status == 201){
          $scope.job.country = res.country.name;
          $scope.job.city = res.city.name;
          $scope.job.location_id = res.id;
        }
      },function(err){
        console.log(err);
      })
    }
    function addJobPhoto(){
      documentService.profileDoc().then(function(res){
            if(res.status == 201){
              $scope.job.image_ids = res.id //shuld be an array
              addJobInfo();

            }
      },function(err){
        console.log(err);
      })
    }
    function addJobInfo(){
      jobListService.addJob($scope.job).then(function(res){
        if(res.status == 201){
          console.log(res);
          $scope.closeThisDialog();
          toastr.success('Your job has been created',{
            closeButton: true,
            preventOpenDuplicates: true
          });
        }

      },function(err){
        console.log(err);
      })
    }


    $scope.category();
  }]);
