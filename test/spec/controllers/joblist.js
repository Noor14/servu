'use strict';

describe('Controller: jobListCtrl', function () {

  // load the controller's module
  beforeEach(module('servu'));

  var jobListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    jobListCtrl = $controller('jobListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(jobListCtrl.awesomeThings.length).toBe(3);
  });
});
