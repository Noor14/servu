'use strict';

describe('Controller: forgetCtrl', function () {

  // load the controller's module
  beforeEach(module('servu'));

  var forgetCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    forgetCtrl = $controller('forgetCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(forgetCtrl.awesomeThings.length).toBe(3);
  });
});
