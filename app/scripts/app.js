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
    'ui.toggle',
    'ae-datetimepicker',
    'angular-input-stars',
    'uiGmapgoogle-maps',
    'ngActionCable',
    'toastr',
    'infinite-scroll',
    'socialLogin',
    'naif.base64',
    'luegg.directives',
    'rzModule'
  ])
  .run(['$transitions', '$rootScope', 'credentialService', '$state', '$location', 'host',  '$http', 'ActionCableConfig','cableUrl',
    function($transitions, $rootScope, credentialService, $state, $location, host,  $http, ActionCableConfig, cableUrl){
      $transitions.onStart({}, function($transition) {
        $rootScope.notifyToggle = $rootScope.displayToggle = 'setting-close';
        $rootScope.sidemenu='display-not';
      $rootScope.sidemenuHome='display-not';
      function checkLogin(){
        var userCredential = JSON.parse(localStorage.getItem("userDetail"));
        if(userCredential){
          var headers = {
            'Content-type': 'application/JSON',
            token: userCredential.data.token,
            client: userCredential.data.client,
            uid: userCredential.data.uid
          };
          ActionCableConfig.wsUri = cableUrl+'?uid='+userCredential.data.uid+'&client='+userCredential.data.client+'&token='+userCredential.data.token;
          ActionCableConfig.autoStart= false;
          ActionCableConfig.debug = true;
        }
        var obj={
          url: host+ "/auth/validate_token",
          method: "GET",
          headers: headers
        };
        if(headers) {
          if (credentialService.authed && !$transition.$to().self.hasOwnProperty("data")) {
            $state.go($transition.$from().self.name);
          }
          else if (credentialService.authed && $transition.$to().self.hasOwnProperty("data")) {

            if($transition.$to().self.url != "/job-detail/:id"){
              $state.go($transition.$to().self.name);
            }
          }

          else{
          $http(obj).then(function (res) {
            if (res.status == 200) {
              credentialService.authed = true;
              if($location.$$url == '/user/dashboard'){
              $state.go("user.joblist");

              }
            }

            else {
              localStorage.clear();
              $state.go("home.login");
            }

          },function(err){
            console.log(err);
            localStorage.clear();
            $state.go("home.login");
          });
          }
        }
        else{
          if(credentialService.authed && !$transition.$to().self.hasOwnProperty("data")){
            $state.go($transition.$from().self.name);
          }
          else if (!credentialService.authed && !$transition.$to().self.hasOwnProperty("data")) {
            $state.go($transition.$to().self.name);
          }
          else if (!credentialService.authed && $transition.$to().self.hasOwnProperty("data")) {
            $state.go("home.login");
          }
        }
      }
      checkLogin();



    });

  }])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'socialProvider', '$qProvider','uiGmapGoogleMapApiProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider, socialProvider, $qProvider, GoogleMapApiProviders) {
    socialProvider.setGoogleKey("1065697815705-o2tn5bfkb55pdbp8e0imil21lbvk99bm.apps.googleusercontent.com");
    socialProvider.setFbKey({appId: "1831395580221168", apiVersion: "v2.10"});
    $qProvider.errorOnUnhandledRejections(false);
      GoogleMapApiProviders.configure({
        china: true
      });
    // $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');
    $urlRouterProvider.otherwise('/user/dashboard');
    $stateProvider
      .state('home', {
        url: '',
        abstract: true,
        templateUrl: 'views/home.html',
        controller: 'homeCtrl',
        controllerAs: 'vm'
      })
      .state('home.main', {
        url:'/home',
        templateUrl: 'views/LandingPageTemplates/main.html',
        controller: 'homeCtrl',
        controllerAs: 'vm'
      })
      .state('home.about', {
        url:'/about',
        templateUrl: 'views/LandingPageTemplates/about.html',
        controller: 'aboutCtrl',
        controllerAs: 'vm'
      })
      .state('home.login',{
        url:'/login',
        templateUrl: 'views/LandingPageTemplates/login.html'
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
      .state('home.contact', {
        url:'/contact',
        templateUrl: 'views/LandingPageTemplates/contact.html',
        controller: 'contactCtrl',
        controllerAs: 'vm'
      })

      .state('home.service', {
        url:'/services',
        templateUrl: 'views/LandingPageTemplates/service.html',
        controller: 'serviceCtrl',
        controllerAs: 'vm'
      })
      .state('home.newsletter', {
        url:'/news-letter',
        templateUrl: 'views/LandingPageTemplates/newsletter.html',
        controller: 'NewsletterCtrl',
        controllerAs: 'vm'
      })
      .state('user', {
        url: '/user',
        abstract: true,
        templateUrl: 'views/user.html',
        controller: 'dashboardCtrl',
        controllerAs: 'vm'
      })
      .state('user.jobDetail', {
        url:'/job-detail/:id',
        templateUrl: 'views/templates/jobDetail.html',
        controller: 'JobDetailCtrl',
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
        controller: 'MessageCtrl',
        controllerAs: 'vm',
        data: {
          authRequired: true
        }

      })
      .state('user.profile', {
        url:'/profile',
        templateUrl: 'views/templates/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'vm',
        data: {
          authRequired: true
        }
      });
  }]);
