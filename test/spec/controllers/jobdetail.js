'use strict';

describe('Controller: JobDetailCtrl', function () {

  // load the controller's module
  beforeEach(module('servu'));

  var JobDetailCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    JobDetailCtrl = $controller('JobDetailCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(JobDetailCtrl.awesomeThings.length).toBe(3);
  });
});
