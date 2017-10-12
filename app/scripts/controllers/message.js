'use strict';

/**
 * @ngdoc function
 * @name servu.controller:MessageCtrl
 * @description
 * # MessageCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('MessageCtrl',['ActionCableChannel', function (ActionCableChannel, ActionCableSocketWrangler) {
    var vm = this;
    vm.msg = {};
    vm.inputText = "";
    vm.myData = [];

    //ActionCableSocketWrangler.start();
    console.log(ActionCableSocketWrangler);
    var consumer = new ActionCableChannel("ChatChannel");

    vm.message = function(){

      consumer.send(vm.msg,'receive');
    }

  }]);
