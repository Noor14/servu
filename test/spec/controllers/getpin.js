'use strict';

describe('Controller: getPinCtrl', function () {

  // load the controller's module
  beforeEach(module('servu'));

  var getPinCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    getPinCtrl = $controller('getPinCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(getPinCtrl.awesomeThings.length).toBe(3);
  });
});
