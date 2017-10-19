'use strict';

/**
 * @ngdoc function
 * @name servu.controller:editProfileCtrl
 * @description
 * # editProfileCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('editProfileCtrl',['$scope','locationService', 'profileService','toastr', function ($scope, locationService, profileService,toastr) {

    $scope.obj={};
    $scope.accountInfo = JSON.parse(localStorage.getItem("userDetail"));
    $scope.userData = $scope.accountInfo.data.user;

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
      },
      options: {
        draggable: true
      },
      events: {
        dragend: function(marker, eventName, args) {
          $scope.cityName = $scope.message =  '';
          $scope.lat = marker.getPosition().lat();
          $scope.lon = marker.getPosition().lng();
          console.log($scope.lat);
          console.log($scope.lon);
          var latlng = new google.maps.LatLng($scope.lat, $scope.lon);
          var geocoder  = new google.maps.Geocoder();
          geocoder.geocode({ 'latLng': latlng }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              if (results.length){
                //$scope.address = results[0].formatted_address;
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

        }
      }
    };



    function getProfile(id){
      profileService.getProfile(id).then(function(res){
        if(res.status==200){
          $scope.obj.name = res.data.name;
          $scope.obj.phone = res.data.phone;
          $scope.obj.about = res.data.about;
          if(res.data.location.id){
            $scope.locationId = res.data.location.id;
            $scope.address = res.data.location.city.name+ " " + res.data.location.country.name;
            $scope.marker.coords.latitude = $scope.map.center.latitude = res.data.location.latitude;
            $scope.marker.coords.longitude = $scope.map.center.longitude = res.data.location.longitude;
          }
        }
      })
    }
    
    $scope.updateProfile = function(){
      $scope.pageLoader = true;
      if($scope.location_id){
        $scope.obj.location_id = $scope.location_id;
      }
      if($scope.profile_pic_id){
        $scope.obj.profile_pic_id = $scope.profile_pic_id;
      }
      profileService.updateProfile($scope.obj).then(function(res){
        if(res.status == 200){
          $scope.pageLoader = false;
          console.log(res);
          toastr.success('Profile has been updated',{
            closeButton: true
          });
          $scope.closeThisDialog();

        }

      },function(err){
        $scope.pageLoader = false;
        console.log(err)
      });

    };
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
            if(!$scope.locationId){
            getLocation(locationObj);
            }
            else{
              updateLocation($scope.locationId, locationObj)
            }
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
          $scope.address = res.data.city.name + " " + res.data.country.name;
          $scope.location_id = res.data.id;
          $scope.marker.coords.latitude = $scope.map.center.latitude = res.data.location.latitude;
          $scope.marker.coords.longitude = $scope.map.center.longitude = res.data.location.longitude;
        }
      },function(err){
        console.log(err);
      })
    }
    function updateLocation(id, locationObj){
      locationService.updateLocation(id, locationObj).then(function(res){
        if(res.status==200){
          $scope.address = res.data.city.name + " " + res.data.country.name;
          $scope.location_id = res.data.id;
          $scope.marker.coords.latitude = $scope.map.center.latitude = res.data.location.latitude;
          $scope.marker.coords.longitude = $scope.map.center.longitude = res.data.location.longitude;
        }
      },function(err){
        console.log(err);
      })
    }
    getProfile($scope.userData.id);



  }]);
