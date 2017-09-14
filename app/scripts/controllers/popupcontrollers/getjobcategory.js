'use strict';

/**
 * @ngdoc function
 * @name servu.controller:getjobCategoryCtrl
 * @description
 * # getjobCategoryCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('getjobCategoryCtrl',['$scope', '$rootScope', 'jobCategory', 'uiGmapGoogleMapApi', function ($scope, $rootScope, jobCategory, uiGmapGoogleMapApi){

    $scope.job = {};




    $scope.map = {
      center: { latitude: 24.774265, longitude: 46.738586 },
      zoom: 14
    };
    var markerEvents = {
      dragend: function (marker, eventName, args) {
        var lat = marker.getPosition().lat();
        var lon = marker.getPosition().lng();

        $scope.marker.options = {
          draggable: true,
          // labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
          labelAnchor: "100 0",
          labelClass: "marker-labels"
        };

        $scope.new_loc.latitude = $scope.marker.coords.latitude;
        $scope.new_loc.longitude = $scope.marker.coords.longitude;
        Map.setCoords($scope.marker.coords);

      }
    };

    $scope.marker = {
      id: 0,
      coords: {
        latitude: 0,
        longitude: 0
      },
      options: {draggable: true},
      events: markerEvents
    };

    $scope.step = 1;
    $scope.category = function(){
      $rootScope.popupLoader = true;
      jobCategory.getjobCategory().then(function(res){
        console.log(res,"res");
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
        console.log(res);
      })
    };
    $scope.gotoDetail = function(service){
      console.log(service,"service");
      $scope.job.service_id = service.id;
      console.log($scope.job,"$scope.job");

      $scope.step = 3;
    };
    $scope.navigate = function(page_no){
      $scope.step = page_no -1;
    };

    $scope.category()
  }]);
