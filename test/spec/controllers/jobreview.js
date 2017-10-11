'use strict';

describe('Controller: jobReviewCtrl', function () {

  // load the controller's module
  beforeEach(module('servu'));

  var jobReviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    jobReviewCtrl = $controller('jobReviewCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(jobReviewCtrl.awesomeThings.length).toBe(3);
  });
});
