'use strict';

/**
 * @ngdoc function
 * @name servu.controller:EditjobCtrl
 * @description
 * # EditjobCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('EditjobCtrl',['toastr', '$scope', 'JobDetail', 'locationService', 'documentService', 'jobListService', function (toastr, $scope, JobDetail, locationService, documentService, jobListService) {
    $scope.jobspinner = 'jobspinner';
    $scope.contractDays = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Bi-Annually'];
    $scope.step = 3;
    $scope.job = JobDetail;
    $scope.job.address = JobDetail.location.street;
    $scope.job.area = JobDetail.location.area;
    $scope.job.city = JobDetail.location.city.name;
    $scope.job.country = JobDetail.location.country.name;
    $scope.job.category_id = JobDetail.category.id;
    $scope.job.service_id = JobDetail.service.id;
    $scope.accountInfo = JSON.parse(localStorage.getItem("userDetail"));
    $scope.userData = $scope.accountInfo.data.user;
    $scope.job.phone = $scope.userData.phone;


    if(JobDetail.images && JobDetail.images.length){
      $scope.job.image_ids=[];
      $scope.jobImages= JobDetail.images;
    }
    else{
       $scope.job.image_ids = [];
      $scope.jobImages =[];

    }

    if(!$scope.job.job_type){
      $scope.activeUrgent = 'active full-width';
    }
    else if($scope.job.job_type == 1){
      $scope.activeSchedule = 'active full-width';
    }
    else if($scope.job.job_type == 2){
      $scope.activeContract = 'active full-width';
    }







    $scope.map = {
      center: {
        latitude:$scope.job.location.latitude,
        longitude: $scope.job.location.longitude
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
        latitude: $scope.job.location.latitude,
        longitude: $scope.job.location.longitude
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


    $scope.jobType = function(type){
      $scope.job.job_type = type;
      if($scope.job.job_type == 2){
        $scope.job.contract={};
        delete $scope.job.schedule;
        $scope.contType = true;
        $scope.schedule = false;

      }
      else if($scope.job.job_type == 1){
        $scope.job.schedule='';
        $scope.schedule = true;
        $scope.contType = false;
        delete $scope.job.contract;

      }
      else{
        $scope.schedule = $scope.contType = false;
        delete $scope.job.schedule;
        delete $scope.job.contract;




      }

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
          if (res.data.length) {
            if(!$scope.cityInfo){
              $scope.cityInfo = res.data[0];
              $scope.locationObj = {
                longitude: $scope.lon,
                latitude: $scope.lat,
                city_id: $scope.cityInfo.id,
                street:$scope.job.address,
                area: $scope.job.area,
                country_id: $scope.cityInfo.country_id
              };
            }
            else{
              $scope.locationObj = {
                longitude: $scope.lon,
                latitude: $scope.lat,
                city_id: $scope.cityInfo.id,
                street:$scope.job.address,
                area: $scope.job.area,
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
    function updateLocation(id, locationObj){
      locationService.updateLocation(id, locationObj).then(function(res){
        if(res.status == 200){
          $scope.job.location_id = res.data.id;
          $scope.job.country = res.data.country.name;
          $scope.job.city = res.data.city.name;
          $scope.marker.coords.latitude = $scope.map.center.latitude = res.data.location.latitude;
          $scope.marker.coords.longitude = $scope.map.center.longitude = res.data.location.longitude;
        }
      },function(err){
        console.log(err);
      })
    }


    $scope.$watch('job.photo', function(newValue, oldValue){
      console.log(oldValue,'oldValue');
      console.log(newValue,'newValue');

      if(newValue != undefined && newValue.length <= 5 ){
        angular.forEach(newValue, function(obj){
          var pix = "data:" + obj.filetype + ";base64,"+ obj.base64;
          addJobPhoto(pix);
        })
      }
    });

    $scope.updateJob = function() {
      $scope.jobLoader = true;
        addJobInfo();
    };

    function addJobPhoto(pix){
      documentService.profileDoc({input:pix}).then(function(res){
        if(res.status == 201){
          $scope.job.image_ids.push(res.data.id);
          $scope.jobImages.push(res.data);
          console.log("res.data",res.data);
        }
      },function(err){
        $scope.jobLoader = false;
        console.log(err);
      })
    }
    $scope.deleteJobPhoto = function(img, index){
      documentService.deleteDoc(img.id).then(function(res){
        if(res.status == 204){
          $scope.job.image_ids.splice(img.id, 1);
          $scope.jobImages.splice(index, 1);
        }
      },function(err){
        $scope.jobLoader = false;
        console.log(err);
      })
    };
    function addJobInfo(){
      if($scope.job.schedule){
        $scope.job.schedule = new Date($scope.job.schedule).toString();
      }
      if($scope.job.contract && $scope.job.contract.first_service_date){
        $scope.job.contract.contract_type = Number( $scope.job.contract.contract_type);
        $scope.job.contract.first_service_date = new Date($scope.job.contract.first_service_date).toString();
      }
      if($scope.job.images && !$scope.job.images.length){
        delete $scope.job.images;
      }
      if($scope.job.image_ids && !$scope.job.image_ids.length){
        delete $scope.job.image_ids;
      }

      jobListService.updateUserJob($scope.job).then(function(res){
        if(res.status == 200){
          console.log(res);
          $scope.jobLoader = false;
          $scope.closeThisDialog();
          toastr.success('Your job has been updated',{
            closeButton: true,
            preventOpenDuplicates: true
          });
        }

      },function(err){
        $scope.jobLoader = false;
        console.log(err);
      })
    }

  }]);
