'use strict';

describe('Controller: signupCtrl', function () {

  // load the controller's module
  beforeEach(module('servu'));

  var signupCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    signupCtrl = $controller('signupCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(signupCtrl.awesomeThings.length).toBe(3);
  });
});
