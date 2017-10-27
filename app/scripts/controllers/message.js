'use strict';

/**
 * @ngdoc function
 * @name servu.controller:MessageCtrl
 * @description
 * # MessageCtrl
 * Controller of the servu
 */
angular.module('servu')
  .controller('MessageCtrl',['toastr', 'ActionCableChannel', 'ActionCableSocketWrangler', 'messageService', '$rootScope',
    function (toastr, ActionCableChannel, ActionCableSocketWrangler, messageService, $rootScope) {
    var vm = this;
    vm.msg = {};
    vm.messages=[];
    vm.glued = true;
    vm.accountInfo = JSON.parse(localStorage.getItem("userDetail"));
    vm.userData = vm.accountInfo.data.user;
    var consumer = new ActionCableChannel("ConversationsChannel");

    vm.callback = function(message){
      vm.messages.push(message);
    };
    function socket_connect(){
      ActionCableSocketWrangler.start();
      consumer.subscribe(vm.callback).then(function(){
      vm.message = function(){
        vm.msg.conversation_id = vm.conversation_id;
              consumer.send(vm.msg, 'receive');
            console.log(vm.msg);
            vm.msg = {};
          };
    });
      consumer.onConfirmSubscription(function(){
        console.log('subscribed');
        vm.chatLoader = $rootScope.pageLoader = false;
        toastr.success('Chat connected',{
          preventDuplicates:true
        });
      });
    }

    vm.send = function(e){
      if(e.keyCode == 13 && vm.msg.body){
        vm.message();
      }
    };

     function conversationList(page, time){
       $rootScope.pageLoader = true;
       messageService.allConversation(page, time).then(function(res){
         if(res.status == 200){
           vm.conversations = res.data.conversations;
           if(vm.conversations.length){
             vm.status = vm.chatSection = true;
             socket_connect();
           }
           else{
             $rootScope.pageLoader = false
           }
         }
       },function(err){
         console.log(err);
       })
     }
    function jobMessages(page, time){
      var id = localStorage.getItem('jobId');
      vm.status = true;
      var conversation_id = localStorage.getItem('conversation_id');
      vm.chatLoader = true;
      messageService.allMessages(id, page, time).then(function(res){
        if(res.status == 200){
          vm.messages = res.data.messages.reverse();
          vm.conversation_id = conversation_id;
            vm.chatSection = true;
          vm.status=false;
            socket_connect();

        }
      },function(err){
        $rootScope.pageLoader = false;
        console.log(err);
      })
    }



    vm.conversationList = function(page, time){
      ActionCableSocketWrangler.stop();
      var id = localStorage.getItem('jobId');
      var notifyConvoId = localStorage.getItem('notify_conversation_id');
      if(!id && !notifyConvoId){
        vm.convlist = 'con-display';
        conversationList(page, time);
      }
      else if(id && !notifyConvoId){
        vm.convlist='con-display-not';
        vm.chatbox = 'col-md-offset-2';
        jobMessages(page, time);
      }
      else if(!id && notifyConvoId){
        vm.convlist='con-display-not';
        vm.chatbox = 'col-md-offset-2';
        vm.openConversation(vm.notifyConvoId, page, time)
      }
    };

    vm.openConversation = function(id, page, time){
      vm.chatLoader = true;
      vm.conversation_id = id;
      messageService.getSpecConversation(id, page, time).then(function(res){
        if(res.status == 200){
          console.log(res);
          vm.chatSection = true;
          vm.status = vm.chatLoader = false;
          vm.messages = res.data.messages.reverse();

        }
      },function(err){
        vm.chatLoader = false;
        console.log(err)
      })
    };





    vm.conversationList('', '');
  }]);
