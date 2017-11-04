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

    $scope.jobImages=[];
    $scope.partsImage=[];
    $scope.part_Img = [];
    $scope.partsfield = true;

      $scope.contractDays = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Bi-Annually'];
    $scope.minDate = new Date();
    $scope.job = {
      job_type : 0,
      image_ids:[],
      parts:[]

    };
    $scope.accountInfo = JSON.parse(localStorage.getItem("userDetail"));
    $scope.userData = $scope.accountInfo.data.user;
    $scope.job.phone = $scope.userData.phone;


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

        }
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
            if (!$scope.cityInfo) {
              $scope.cityInfo = res.data[0];
              $scope.locationObj = {
                longitude: $scope.lon,
                latitude: $scope.lat,
                street : $scope.job.address,
                city_id: $scope.cityInfo.id,
                country_id: $scope.cityInfo.country_id
              };
              $scope.job.city = $scope.cityInfo.name;
            }
            else {
              $scope.locationObj = {
                longitude: $scope.lon,
                latitude: $scope.lat,
                street : $scope.job.address,
                city_id: $scope.cityInfo.id,
                country_id: $scope.cityInfo.country_id
              };
              $scope.job.city = $scope.cityInfo.name;
            }
            $scope.job.country = "Saudi Arabia";
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
          $scope.job.location_id = res.data.id;
          addJobInfo();
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
      $scope.step = 3;
      if($scope.step == 3){
     document.getElementsByClassName('ngdialog-content')[0].style.width = "850px";
      }
    };
    $scope.navigate = function(page_no){
      $scope.step = page_no -1;
      if($scope.step < 3){
        document.getElementsByClassName('ngdialog-content')[0].style.width = "450px";
      }
    };
    $scope.jobType = function(type){
      $scope.job.job_type = type;


      if($scope.job.job_type == 0){
        $scope.schedule= $scope.contType = false;

      }
      else if($scope.job.job_type == 1){
        $scope.job.schedule='';
        $scope.schedule = true;
        $scope.contType = false;

      }
      else if($scope.job.job_type == 2){
        $scope.job.contract = {};
        $scope.contType = true;
        $scope.schedule = false;


      }
    };


      $scope.$watch('job.photo', function(newValue, oldValue){
        $scope.overSize='';
        if(newValue != undefined && newValue.filesize < 5242880 ){
          var pix = "data:" + newValue.filetype + ";base64,"+ newValue.base64;
          addJobPhoto(pix);
        }
        else if(newValue != undefined){
          $scope.overSize = "Please select an image less than 5MB.";
        }
      });

      $scope.$watch('job.partImg', function(newValue, oldValue){
        $scope.overPartSize='';
        if(newValue != undefined && newValue.filesize < 5242880 ){
          var pix = "data:" + newValue.filetype + ";base64,"+ newValue.base64;
          addPartImgPhoto(pix);
        }
        else if(newValue != undefined){
          $scope.overPartSize = "Please select an image less than 5MB.";
        }
      });
      $scope.$watch('job.part', function(newValue, oldValue){
        $scope.overPartimgSize='';
        if(newValue != undefined && newValue.filesize < 5242880 ){
          var pix = "data:" + newValue.filetype + ";base64,"+ newValue.base64;
          addPartPhoto(pix);
        }
        else if(newValue != undefined){
          $scope.overPartimgSize = "Please select an image less than 5MB.";
        }
      });

    $scope.incPart = function(data){
      if(data){
        $scope.partObj={
          part_number:data,
          image_ids :$scope.part_Img
        };

      $scope.partsImage.push($scope.partObj);
        $scope.job.part_no='';
        $scope.part_Img=[];
      }
    };
      $scope.decPart = function(index){
        $scope.partsImage.splice(index, 1);
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
       else if($scope.cityName && $scope.cityInfo && !$scope.job.location_id){
        $scope.locationObj.area = $scope.job.area;
        getLocation($scope.locationObj);
      }

      };

      function addJobPhoto(pix){
        documentService.profileDoc({input:pix}).then(function(res){
              if(res.status == 201){
                $scope.job.image_ids.push(res.data.id) ; //should be an array
                $scope.jobImages.push(res.data);
                console.log("res.data",res.data);
              }
        },function(err){
          $scope.jobLoader = false;
          console.log(err);
        })
      }
      function addPartImgPhoto(pix){
        documentService.profileDoc({input:pix}).then(function(res){
          if(res.status == 201){
            $scope.part_Img.push(res.data);
            console.log("res.data",res.data);
          }
        },function(err){
          $scope.jobLoader = false;
          console.log(err);
        })
      }
      function addPartPhoto(pix){
        documentService.profileDoc({input:pix}).then(function(res){
          if(res.status == 201){
            $scope.partsImage[$scope.partialpartIndex].image_ids.push(res.data);
            console.log("res.data",res.data);
          }
        },function(err){
          $scope.jobLoader = false;
          console.log(err);
        })
      }
      $scope.insertImage = function(index){
        $scope.partialpartIndex = index;
        console.log($scope.partialpartIndex,'vm.partialpartIndex');
      };
      $scope.deleteJobPhoto = function(img, index){
        documentService.deleteDoc(img.id).then(function(res){
          if(res.status == 204){
            var index_Of = $scope.job.image_ids.indexOf(img.id);
            $scope.job.image_ids.splice(index_Of,1);
            $scope.jobImages.splice(index, 1);
          }
        },function(err){
          $scope.jobLoader = false;
          console.log(err);
        })
      };
      $scope.deletePartarrayPhoto = function(img, index){
        documentService.deleteDoc(img.id).then(function(res){
          if(res.status == 204){

            $scope.partsImage.forEach(function(obj){
              var index = obj.image_ids.indexOf(img);
              if(index > -1){
                  obj.image_ids.splice(index, 1);
                  }
            });
          }
        },function(err){
          $scope.jobLoader = false;
          console.log(err);
        })
      };
      $scope.deletePartPhoto = function(img, index){
        documentService.deleteDoc(img.id).then(function(res){
          if(res.status == 204){
            $scope.part_Img.splice(index, 1);
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
        if($scope.partsImage.length){
          var partsImages = angular.copy($scope.partsImage);
          partsImages.forEach(function(obj, index){
            var number = obj.image_ids.map(function(item){
              return item['id'];
            });
            partsImages[index].image_ids = number;
            $scope.job.parts.push(partsImages[index]);


          });
        }
        if($scope.job.part_no){
          if($scope.part_Img.length){
           var images = angular.copy($scope.part_Img);
            var number = images.map(function(item){

              return item['id'];

            });
            images = number;
            $scope.job.parts.push({part_number: $scope.job.part_no, image_ids : images})
          }
          else{
            $scope.job.parts.push({part_number: $scope.job.part_no, image_ids : []})

          }
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
