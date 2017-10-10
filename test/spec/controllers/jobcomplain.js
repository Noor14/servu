'use strict';

describe('Controller: jobComplainCtrl', function () {

  // load the controller's module
  beforeEach(module('servu'));

  var jobComplainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    jobComplainCtrl = $controller('jobComplainCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(jobComplainCtrl.awesomeThings.length).toBe(3);
  });
});
