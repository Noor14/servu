'use strict';

/**
 * @ngdoc service
 * @name servu.header
 * @description
 * # header
 * Value in the servu.
 */
angular.module('servu')
  .service('header', function (){
    var vm = this;
    vm.userCredential;
    vm.userAuth= {
      'Content-type': 'application/JSON'
    };
    vm.authorize = function(data){
      vm.userCredential = data;
      vm.userAuth.token= vm.userCredential.data.token;
        vm.userAuth.client= vm.userCredential.data.client;
        vm.userAuth.uid= vm.userCredential.data.uid;
    };


});


