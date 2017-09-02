'use strict';

/**
 * @ngdoc service
 * @name servu.twitterService
 * @description
 * # twitterService
 * Service in the servu.
 */
angular.module('servu')
  .service('twitterService', ['$q', function ($q) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var vm = this;
    vm.authorizationResult = false;

    vm.initialize = function () {
      //initialize OAuth.io with public key of the application
      OAuth.initialize('-1DZkjsPEOKzE09Mho6gEKSpMpA', {
        cache: true
      });
      //try to create an authorization result when the page loads,
      // this means a returning user won't have to click the twitter button again
      vm.authorizationResult = OAuth.create("twitter");
    };
    vm.isReady = function () {
      return (vm.authorizationResult);
    };
    vm.connectTwitter = function () {
      var deferred = $q.defer();
      OAuth.popup("twitter", {
        cache: true
      }, function (error, result) {
        // cache means to execute the callback if the tokens are already present
        if (!error) {
          vm.authorizationResult = result;
          deferred.resolve(result);
        } else {
          //do something if there's an error

        }
      });
      return deferred.promise;
    };
    vm.clearCache = function () {
      OAuth.clearCache('twitter');
      vm.authorizationResult = false;
    };

    vm.getLatestTweets = function (maxId) {
      //create a deferred object using Angular's $q service
      var deferred = $q.defer();
      var url = '/1.1/statuses/home_timeline.json';
      if (maxId) {
        url += '?max_id=' + maxId;
      }
      var promise = authorizationResult.get(url).done(function (data) {
        // https://dev.twitter.com/docs/api/1.1/get/statuses/home_timeline
        // when the data is retrieved resolve the deferred object
        deferred.resolve(data);
      }).fail(function (err) {
        deferred.reject(err);
      });
      //return the promise of the deferred object
      return deferred.promise;
    }
  }]);
