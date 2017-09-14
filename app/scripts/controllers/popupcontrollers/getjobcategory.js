'use strict';

/**
 * @ngdoc function
 * @name servu.controller:getjobCategoryCtrl
 * @description
 * # getjobCategoryCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('getjobCategoryCtrl',['$scope', '$rootScope', 'toastr', 'jobCategory', 'locationService','documentService', 'jobListService', 'ngDialog', 'uiGmapGoogleMapApi', 'uiGmapIsReady',
    function ($scope, $rootScope, toastr, jobCategory, locationService, documentService, jobListService, ngDialog, uiGmapGoogleMapApi, uiGmapIsReady){

    $scope.job = {};
    $scope.step = 1;
    $scope.map = {
      center: { latitude: 24.774265, longitude: 46.738586 },
      zoom: 14,
      control: {},
      events: {
        click: function (map, eventName, originalEventArgs) {
          var e = originalEventArgs[0];
          $scope.geocodePosition(e.latLng);
        }
      }
    };
    $scope.geocodePosition = function(pos) {
      var map = $scope.map.control.getGMap();
      var service = new google.maps.places.PlacesService(map);
      var request = {
        location: pos,
        radius: '500',
        //types: ['store']
      };
      service.nearbySearch(request, function(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          var place = results[0];
          alert(place.name);
        }
      });
    };

    uiGmapIsReady.promise().then(function(maps) {
      //...
    });
    //$scope.$watch('$scope.map.center', function (newValue, oldValue) {
    //  if (newValue !== oldValue) {
    //    console.log("value change");
    //    var center = map.getCenter(),
    //      latitude = center.lat(),
    //      longitude = center.lng();
    //    if ($scope.latitude !== latitude || $scope.longitude !== longitude)
    //      map.setCenter(new google.maps.LatLng($scope.latitude, $scope.longitude));
    //  }
    //});

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

    $scope.createJob = function(){
      getLocation();
    };


    function getLocation(){
      locationService.addLocation().then(function(res){
        console.log(res);
        if(res.status == 201){
          $scope.job.country = res.country.name;
          $scope.job.city = res.city.name;
          $scope.job.location_id = res.id;
          if($scope.job.photo){
          addJobPhoto();
          }
          else{
            addJobInfo();
          }
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
