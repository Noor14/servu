'use strict';

/**
 * @ngdoc function
 * @name servu.controller:contactCtrl
 * @description
 * # contactCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('contactCtrl',['toastr','contactService', function (toastr, contactService) {
    var vm = this;
      vm.contact={};

    vm.sendMessage = function(){
      vm.loading= true;
      contactService.contact(vm.contact).then(function(res){
        vm.loading= false;
        if(res.status == 201){
          toastr.success('Your message has been send');
          vm.contact={};
        }

      },function(err){
        vm.loading= false;
        consoloe.log(err);

      })
    }
  }]);
