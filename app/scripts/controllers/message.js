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
    vm.connection;
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
        if(!vm.connection){
          vm.connection = 'connected';
          connection_Toaster();

        }

      });

    }
      function connection_Toaster(){
        toastr.success('Chat connected',{
          preventDuplicates:true
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
           vm.chatSection = true;
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
      var conversation_id = localStorage.getItem('conversation_id');
      vm.chatSection = vm.chatLoader = true;
      messageService.allMessages(id, page, time).then(function(res){
        if(res.status == 200){
          vm.messages = res.data.messages.reverse();
          vm.conversation_id = conversation_id;
            socket_connect();

        }
      },function(err){
        $rootScope.pageLoader = false;
        console.log(err);
      })
    }



    vm.conversationList = function(page, time){
     vm.id = localStorage.getItem('jobId');
      vm.notifyConvoId = localStorage.getItem('notify_conversation_id');
      if(!vm.id && !vm.notifyConvoId){
        vm.convlist = 'con-display';
        vm.chatArea = false;
        conversationList(page, time);
      }
      else if(vm.id && !vm.notifyConvoId){
        vm.convlist='con-display-not';
        vm.chatbox = 'col-md-offset-2';
        vm.chatArea = true;
        jobMessages(page, time);
      }
      else if(!vm.id && vm.notifyConvoId){
        vm.convlist='con-display-not';
        vm.chatbox = 'col-md-offset-2';
        vm.chatArea = true;
        vm.openConversation(vm.notifyConvoId, page, time)
      }
    };
   $rootScope.$on('size',function(arg){
     vm.size = arg.targetScope.windowWidth;
     if(vm.size >= 991){
       if(!vm.notifyConvoId && !vm.id){
         vm.chatbox = vm.convlist = 'con-display';
       }
       else if(vm.id || vm.notifyConvoId){
         vm.chatbox = 'con-display col-md-offset-2';
       }
     }
     if(vm.size < 991 && vm.chatbox != 'con-display'){
       if(!vm.notifyConvoId && !vm.id){
         vm.chatbox = 'con-display-not';
         }
      if(vm.id || vm.notifyConvoId){
         vm.chatbox = 'con-display col-md-offset-2';
       }
     }
     else if(vm.size < 991 && (vm.chatbox == 'con-display' ||  vm.chatbox == 'con-display col-md-offset-2')){
       if(!vm.notifyConvoId && !vm.id) {
         vm.chatbox = 'con-display';
         vm.convlist = 'con-display-not';
       }
       else if(vm.id || vm.notifyConvoId){
         vm.chatbox = 'con-display col-md-offset-2';
       }
     }

    });
      vm.back = function(){
        vm.convlist = 'con-display';
        vm.chatbox = 'con-display-not';

      };
    vm.openConversation = function(id, page, time){
      vm.chatSection = vm.chatLoader = true;
      vm.conversation_id = id;
      if(!vm.size){
        vm.size= screen.width;
      }
      if(vm.size < 991 && !vm.notifyConvoId && !vm.id){
        vm.convlist='con-display-not';
        vm.chatbox = 'con-display';
      }
      messageService.getSpecConversation(id, page, time).then(function(res){
        if(res.status == 200){
          console.log(res);
          vm.chatArea = true;
          vm.chatLoader = false;
          if(vm.notifyConvoId){
            socket_connect();
          }
          vm.messages = res.data.messages.reverse();

        }
      },function(err){
        vm.chatLoader = false;
        console.log(err)
      })
    };





    vm.conversationList('', '');
  }]);
