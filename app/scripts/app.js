'use strict';

/**
 * @ngdoc overview
 * @name servu
 * @description
 * # servu
 *
 * Main module of the application.
 */
angular
  .module('servu', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ngDialog',
    'toastr',
    'socialLogin',
    'naif.base64'
  ])
  .run(['$transitions', '$rootScope', 'credentialService', '$state', '$location', 'host',  '$http',
    function($transitions, $rootScope, credentialService, $state, $location, host,  $http){


    $transitions.onStart({}, function($transition) {
      $rootScope.sidemenu='display-not';
      function checkLogin(){
        var userCredential = JSON.parse(localStorage.getItem("userDetail"));
        if(userCredential){

          var info = {
            token: userCredential.data.token,
            client: userCredential.data.client,
            uid: userCredential.data.uid
          };

        }
        var obj={
          url: host+ "/auth/validate_token",
          method: "GET",
          headers: {'Content-type': 'application/JSON' },
          params : info
        };
        if(info) {
          if (credentialService.authed && !$transition.$to().self.hasOwnProperty("data")) {
            $state.go($transition.$from().self.name);
          }
          $http(obj).then(function (res) {
            console.log(res, "res");
            credentialService.authed = true;
            if (res.status = 200 && $transition.$from().self.url == '/') {
              credentialService.authed = true;
              $state.go("user.joblist");
            }
            else if (credentialService.authed && $transition.$to().self.hasOwnProperty("data")) {
              $location.path($transition.$to().self.url);
            }
            else {
              $location.path($transition.$from().self.url);
            }

          });
        }
        else{
          if(credentialService.authed && !$transition.$to().self.hasOwnProperty("data")){
            $location.path($transition.$from().self.url);
          }
          else if (credentialService.authed == false && !$transition.$to().self.hasOwnProperty("data")) {
            $location.path($transition.$to().self.url);
          }
          else if (!credentialService.authed && $transition.$to().self.hasOwnProperty("data")) {
            $state.go("home.login");
          }
        }
      }
      checkLogin();



    });
  }])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'socialProvider', '$qProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider, socialProvider, $qProvider) {
    socialProvider.setGoogleKey("1065697815705-o2tn5bfkb55pdbp8e0imil21lbvk99bm.apps.googleusercontent.com");
    socialProvider.setFbKey({appId: "1831395580221168", apiVersion: "v2.10"});
    $qProvider.errorOnUnhandledRejections(false);
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('#!');
    $urlRouterProvider.otherwise('/dashboard');
    $stateProvider
      .state('home', {
        url: '',
        abstract: true,
        templateUrl: 'views/home.html',
        controller: 'homeCtrl',
        controllerAs: 'vm'
      })
      .state('home.login',{
        url:'/login',
        templateUrl: 'views/LandingPageTemplates/login.html'
        //controller: 'loginCtrl',
        //controllerAs: 'vm'

      })
      .state('home.forget',{
        url:'/forget-password',
        templateUrl: 'views/LandingPageTemplates/forget.html',
        controller: 'forgetCtrl',
        controllerAs: 'vm'

      })
      .state('home.signup', {
        url:'/signUp',
        templateUrl: 'views/LandingPageTemplates/signup.html',
        controller: 'signupCtrl',
        controllerAs: 'vm'
      })
      .state('user', {
        url: '',
        abstract: true,
        templateUrl: 'views/user.html',
        controller: 'dashboardCtrl',
        controllerAs: 'vm'
      })
      .state('user.jobs', {
        url:'/jobs',
        templateUrl: 'views/templates/jobDetail.html',
        controller: 'jobCtrl',
        controllerAs: 'vm',
        data: {
          authRequired: true
        }
      })
      .state('user.joblist', {
        url:'/dashboard',
        templateUrl: 'views/templates/jobList.html',
        controller: 'jobListCtrl',
        controllerAs: 'vm',
        data: {
          authRequired: true
        }
      })
      .state('user.message', {
        url:'/messages',
        templateUrl: 'views/templates/message.html',
        data: {
          authRequired: true
        }
        //controller: 'messageCtrl',
        //controllerAs: 'vm'
      })
      .state('user.profile', {
        url:'/profile',
        templateUrl: 'views/templates/profile.html',
        data: {
          authRequired: true
        }
        //controller: 'profileCtrl',
        //controllerAs: 'vm'
      });
  }]);
