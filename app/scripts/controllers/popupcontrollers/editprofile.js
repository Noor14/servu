'use strict';

/**
 * @ngdoc function
 * @name servu.controller:editProfileCtrl
 * @description
 * # editProfileCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('editProfileCtrl',['$scope','locationService','documentService', 'profileService','toastr','ngDialog',
    function ($scope, locationService, documentService, profileService,toastr, ngDialog) {

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
          $scope.userType = res.data.user_type;
          $scope.obj.name = res.data.name;
          $scope.obj.phone = res.data.phone;
          $scope.obj.email = res.data.email;
          $scope.obj.about = res.data.about;
          if(res.data.profile_pic){
          $scope.picture = res.data.profile_pic.url;
          }
          if(res.data.location.id){
            $scope.locationId = res.data.location.id;
            $scope.address = res.data.location.city.name+ " " + res.data.location.country.name;
            $scope.marker.coords.latitude = $scope.map.center.latitude = res.data.location.latitude;
            $scope.marker.coords.longitude = $scope.map.center.longitude = res.data.location.longitude;
          }
        }
      })
    }
    $scope.$watch('photo', function(newValue, oldValue){
      console.log(oldValue,'oldValue');
      console.log(newValue,'newValue');

      if(newValue != undefined){
          var pix = "data:" + newValue.filetype + ";base64,"+ newValue.base64;
          addJobPhoto(pix);
      }
    });


    function addJobPhoto(pix){
      documentService.profileDoc({input:pix}).then(function(res){
        if(res.status == 201){
          $scope.profile_pic_id = res.data.id;
          $scope.picture = res.data.url;
        }
      },function(err){
        $scope.jobLoader = false;
        console.log(err);
      })
    }
    $scope.updateProfile = function(){
      $scope.pageLoader = true;

      if(!$scope.locationId && $scope.cityInfo){
        getLocation($scope.locationObj);
      }
      else if($scope.locationId && $scope.cityInfo){
        updateLocation($scope.locationId, $scope.locationObj)
      }
     else{
        update();
      }


    };


      $scope.OpenCategory = function(){
        $scope.skillBox = ngDialog.open({
          template: 'views/dialogTemplates/jobcatergoryPopup.html',
          appendClassName: 'addPopup',
          controller: 'addSkillCtrl'
        });
        $scope.skillBox.closePromise.then(function (data) {
          console.log(data);
          $scope.skills = data.value;
        });
      };
    function update(){
      if($scope.location_id){
        $scope.obj.location_id = $scope.location_id;
      }
      if($scope.profile_pic_id){
        $scope.obj.profile_pic_id = $scope.profile_pic_id;
      }
      if($scope.skills && $scope.skills.length){
        $scope.obj.skills = $scope.skills;
      }
      profileService.updateProfile($scope.obj).then(function(res){
        if(res.status == 200){
          $scope.pageLoader = false;
          $scope.PicChange = res.data.profile_pic;
          $scope.profileObj = {
          name: res.data.name,
          profile_pic: res.data.profile_pic
          };
          $scope.$emit('profileChange', $scope.profileObj);

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
    }
    function getCityId(){
      locationService.searchCity($scope.cityName).then(function(res){
        if(res.status == 200) {
          var cities = res.data;
          $scope.cityInfo = cities.find(function (obj) {
            if (obj.name == $scope.cityName) {
              return obj;
            }
          });
          if (res.data.length) {
            if(!$scope.cityInfo){
              $scope.cityInfo = res.data[0];
              $scope.locationObj = {
              longitude: $scope.lon,
              latitude: $scope.lat,
              city_id: $scope.cityInfo.id,
              country_id: $scope.cityInfo.country_id
            };
              $scope.address = $scope.cityInfo.name + " Saudi Arabia";

            }
            else{
              $scope.locationObj = {
                longitude: $scope.lon,
                latitude: $scope.lat,
                city_id: $scope.cityInfo.id,
                country_id: $scope.cityInfo.country_id
              };
              $scope.address = $scope.cityInfo.name + " Saudi Arabia";

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
          $scope.location_id = res.data.id;
          $scope.marker.coords.latitude = $scope.map.center.latitude = res.data.latitude;
          $scope.marker.coords.longitude = $scope.map.center.longitude = res.data.longitude;
          update();
        }
      },function(err){
        console.log(err);
      })
    }
    function updateLocation(id, locationObj){
      locationService.updateLocation(id, locationObj).then(function(res){
        if(res.status == 200){
          $scope.location_id = res.data.id;
          $scope.marker.coords.latitude = $scope.map.center.latitude = res.data.latitude;
          $scope.marker.coords.longitude = $scope.map.center.longitude = res.data.longitude;
          update();
        }
      },function(err){
        console.log(err);
      })
    }
    getProfile($scope.userData.id);



  }]);
