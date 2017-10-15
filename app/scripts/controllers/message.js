'use strict';

/**
 * @ngdoc function
 * @name servu.controller:MessageCtrl
 * @description
 * # MessageCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('MessageCtrl',['$scope', 'ActionCableChannel','ActionCableController', 'ActionCableSocketWrangler', 'messageService', '$rootScope', function ($scope, ActionCableChannel,ActionCableController, ActionCableSocketWrangler, messageService, $rootScope) {
    var vm = this;
    vm.msg = {};

    vm.accountInfo = JSON.parse(localStorage.getItem("userDetail"));
    vm.userData = vm.accountInfo.data.user;

    vm.callback = function(message){
      vm.messages.push(message);
    };
    var consumer = new ActionCableChannel("ConversationsChannel");
    ActionCableSocketWrangler.start();
    ActionCableController.actions.ping();

    vm.status = ActionCableSocketWrangler.connected;
      consumer.subscribe(vm.callback).then(function(){

          vm.message = function(){
            consumer.send(vm.msg, 'receive');
            console.log(vm.msg);
            vm.msg = {};
          };
    });
    $scope.$on("$destroy", function(){
      consumer.unsubscribe().then(function(){ vm.message = undefined; });
    });






    vm.conversationList = function(page, time){
      $rootScope.pageLoader = true;
      messageService.allConversation(page, time).then(function(res){
          if(res.status == 200){
            $rootScope.pageLoader = false;
          vm.conversations = res.data.conversations;
          }
      },function(err){
        $rootScope.pageLoader = false;
        console.log(err);
      })
    };

    vm.openConversation = function(id, page, time){
      vm.chatLoader = true;
      messageService.getSpecConversation(id, page, time).then(function(res){
        if(res.status == 200){
          console.log(res);
          vm.chatLoader = false;
          vm.messages = res.data.messages.reverse();

        }
      },function(err){
        vm.chatLoader = false;
        console.log(err)
      })
    };


    vm.conversationList('', '');
  }]);
