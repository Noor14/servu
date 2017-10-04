'use strict';

describe('Controller: JobcodeCtrl', function () {

  // load the controller's module
  beforeEach(module('servu'));

  var JobcodeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    JobcodeCtrl = $controller('JobcodeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(JobcodeCtrl.awesomeThings.length).toBe(3);
  });
});
