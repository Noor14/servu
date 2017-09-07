'use strict';

/**
 * @ngdoc service
 * @name servu.credentialService
 * @description
 * # credentialService
 * Service in the servu.
 */
angular.module('servu')
  .service('credentialService',['$http', '$q', 'host',
    function ($http, $q, host) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var vm = this;
    vm.userLogin = function(credential){
      var deffered = $q.defer();
      var obj={
        url: host + "/auth/sign_in",
        method: "POST",
        headers: { 'Content-type': 'application/JSON' },
        data : credential
      };
      $http(obj).then(function(res){
          vm.authed = true;
          deffered.resolve(res);
        },function(err){
          deffered.resolve(err);

        }

      );
      return deffered.promise
    };

    vm.userLogout = function(credential){
      var deffered = $q.defer();
      var obj={
        url: host + "/auth/sign_out",
        method: "DELETE",
        headers: {
          'Content-type': 'application/JSON'
        },
        data : credential

      };
      $http(obj).then(function(res){
          deffered.resolve(res);
        },function(err){
          deffered.resolve(err);

        }

      );
      return deffered.promise
    };

    vm.userSignup = function(info){
      var deffered = $q.defer();
      var obj={
        url: host + "/auth",
        method: "POST",
        headers: { 'Content-type': 'application/JSON' },
        data : info
      };
      $http(obj).then(function(res){
          deffered.resolve(res);
        },function(err){
          deffered.resolve(err);

        }

      );
      return deffered.promise;
    };

    vm.resetPasswordbymail = function(email){
      var deffered = $q.defer();
      var obj={
        url: host + "/auth/password",
        method: "POST",
        headers: { 'Content-type': 'application/JSON' },
        data : email
      };
      $http(obj).then(function(res){
          deffered.resolve(res);
        },function(err){
          deffered.resolve(err);

        }

      );
      return deffered.promise;
    };

    vm.resetPasswordbypin = function(info){
      var deffered = $q.defer();
      var obj={
        url: host+ "/auth/reset_password_with_pin",
        method: "PUT",
        headers: { 'Content-type': 'application/JSON' },
        data : info
      };
      $http(obj).then(function(res){
          deffered.resolve(res);
        },function(err){
          deffered.resolve(err);

        }

      );
      return deffered.promise;
    };

    vm.resendPin = function(detail){
      var deffered = $q.defer();
      var obj={
        url: host + "/auth/resend_phone_confirmation",
        method: "PUT",
        headers: { 'Content-type': 'application/JSON' },
        data : detail
      };
      $http(obj).then(function(res){
        deffered.resolve(res);
      },function(err){
        deffered.resolve(err);
      });
      return deffered.promise;
    };

    vm.phoneConfirm = function(pinCode){
      var deffered = $q.defer();
      var obj={
        url: host + "/auth/confirm_phone",
        method: "PUT",
        headers: { 'Content-type': 'application/JSON' },
        data : pinCode
      };
      $http(obj).then(function(res){
        deffered.resolve(res);
      },function(err){
        deffered.resolve(err);
      });
      return deffered.promise;
    }


  }]);
