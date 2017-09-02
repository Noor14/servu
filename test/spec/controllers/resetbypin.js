'use strict';

describe('Controller: ResetbypinCtrl', function () {

  // load the controller's module
  beforeEach(module('servu'));

  var ResetbypinCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ResetbypinCtrl = $controller('ResetbypinCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ResetbypinCtrl.awesomeThings.length).toBe(3);
  });
});
