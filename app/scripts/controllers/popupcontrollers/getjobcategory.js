'use strict';

/**
 * @ngdoc function
 * @name servu.controller:getjobCategoryCtrl
 * @description
 * # getjobCategoryCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('getjobCategoryCtrl',['$scope', '$rootScope','toastr', 'jobCategory','$timeout', 'locationService','documentService', 'jobListService',
    function ($scope, $rootScope, toastr, jobCategory, $timeout, locationService, documentService, jobListService){


    $scope.contractDays = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Bi-Annually'];
    $scope.jobspinner = 'jobspinner';
    $scope.job = {
      job_type : 0
    };
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
    //$scope.coordsUpdates = 0;
    //$scope.dynamicMoveCtr = 0;
    $scope.marker = {
      id: 0,
      coords: {
        latitude: 24.774265,
        longitude: 46.738586
      },
      options: {
        draggable: true
      },
      events: {
        dragend: function(marker, eventName, args) {
          $scope.cityName = $scope.message = $scope.job.city = $scope.job.country= '';
          $scope.lat = marker.getPosition().lat();
          $scope.lon = marker.getPosition().lng();
          console.log($scope.lat);
          console.log($scope.lon);
          var latlng = new google.maps.LatLng($scope.lat, $scope.lon);
          var geocoder  = new google.maps.Geocoder();
          geocoder.geocode({ 'latLng': latlng }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              if (results.length){
                 $scope.job.address = results[0].formatted_address;
                 var addressArray = results[0].address_components;
                if(addressArray.length){
                  angular.forEach(addressArray, function(obj){
                    angular.forEach(obj.types, function(name){
                      if(name == "locality"){
                       return $scope.cityName = obj.long_name;

                      }
                    });
                  });
                  if($scope.cityName){
                    getCityId();
                  }
                  else if(!$scope.cityName){
                    $scope.message = "Please drag the marker and select the city";

                  }

                }
              }
            }
          });





          //$scope.marker.options = {
          //  draggable: true,
          //  labelContent: "",
          //  labelAnchor: "100 0",
          //  labelClass: "marker-labels"
          //};
        }
      }
    };
    //$scope.$watchCollection("marker.coords", function(newVal, oldVal) {
    //  $scope.map.center.latitude = $scope.marker.coords.latitude;
    //  $scope.map.center.longitude = $scope.marker.coords.longitude;
    //  if (_.isEqual(newVal, oldVal))
    //    return;
    //  $scope.coordsUpdates++;
    //});
    //$timeout(function() {
    //  $scope.marker.coords = {
    //    latitude: 56.162939,
    //    longitude: 10.203921
    //  };
    //  $scope.dynamicMoveCtr++;
    //  $timeout(function() {
    //    $scope.marker.coords = {
    //      latitude: 56.162939,
    //      longitude: 10.203921
    //    };
    //    $scope.dynamicMoveCtr++;
    //  }, 2000);
    //}, 1000);


    // map area above



    function getCityId(){
      locationService.searchCity($scope.cityName).then(function(res){
        if(res.status == 200) {
          var cities = res.data;
          $scope.cityInfo = cities.find(function (obj) {
            if (obj.name == $scope.cityName) {
              return obj;
            }
          });
          if (!$scope.cityInfo) {
            $scope.cityInfo = res.data[0];
          }
          console.log($scope.cityInfo);
          var locationObj = {
            longitude: $scope.lon,
            latitude: $scope.lat,
            city_id: $scope.cityInfo.id,
            country_id: $scope.cityInfo.country_id
          };
          if (res.data.length) {
          getLocation(locationObj);
        }
          else if(!res.data.length){
            $scope.message = "Please drag the marker and select the location only in Saudia Arabia";

          }
        }
        else{
          $scope.message = "Please drag the marker and select the location only in Saudia Arabia";
        }
      },function(err){
        console.log(err);
      })
    }
    function getLocation(locationObj){
      locationService.addLocation(locationObj).then(function(res){
        console.log(res);
        if(res.status == 201){
          $scope.job.country = res.data.country.name;
          $scope.job.city = res.data.city.name;
          $scope.job.location_id = res.data.id;
        }
      },function(err){
        console.log(err);
      })
    }


    $scope.step = 1;
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
      $scope.job.service_id = service.id;
      $scope.className = "addjobPopup";
      $scope.step = 3;
    };
    $scope.navigate = function(page_no){
      $scope.step = page_no -1;
    };
    $scope.jobType = function(type){
      $scope.job.job_type = type;
      if($scope.job.job_type == 2){
        $scope.job.contract = {};
        $scope.contType = true;
        $scope.schedule = false;

      }
      else if($scope.job.job_type == 1){
        $scope.job.schedule='';
        $scope.schedule = true;
        $scope.contType = false;
      }
      else{
        $scope.schedule= $scope.contType = false;
      }

    };


    $scope.createJob = function() {
      $scope.jobLoader = true;
      if(!$scope.lat && !$scope.lon){
        $scope.jobLoader = false;
        $scope.message = "Please drag the marker and select the location"
      }
        else if(!$scope.cityName){
          $scope.jobLoader = false;
          return $scope.message;
     }
        else if($scope.cityName && !$scope.cityInfo){
          $scope.jobLoader = false;
          return $scope.message;
    }
       else if($scope.cityName && $scope.cityInfo && $scope.job.location_id){
        if($scope.job.photo) {
          addJobPhoto();
        }
        else{
          addJobInfo();
        }
      }

      };

      function addJobPhoto(){
        documentService.profileDoc().then(function(res){
              if(res.status == 201){
                $scope.job.image_ids = res.id; //should be an array
                addJobInfo();

              }
        },function(err){
          $scope.jobLoader = false;
          console.log(err);
        })
      }
      function addJobInfo(){
        if($scope.job.schedule){
          $scope.job.schedule = new Date($scope.job.schedule).toString();
        }
        if($scope.job.contract && $scope.job.contract.first_service_date){
          $scope.job.contract.contract_type = Number( $scope.job.contract.contract_type);
          $scope.job.contract.first_service_date = new Date($scope.job.contract.first_service_date).toString();
        }
        jobListService.addJob($scope.job).then(function(res){
          if(res.status == 201){
            console.log(res);
            $scope.jobLoader = false;
            $scope.closeThisDialog();
            toastr.success('Your job has been created',{
              closeButton: true,
              preventOpenDuplicates: true
            });
          }

        },function(err){
          $scope.jobLoader = false;
          console.log(err);
        })
      }






    $scope.category()
  }]);
