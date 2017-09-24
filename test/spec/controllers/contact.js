'use strict';

describe('Controller: contactCtrl', function () {

  // load the controller's module
  beforeEach(module('servu'));

  var contactCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    contactCtrl = $controller('contactCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(contactCtrl.awesomeThings.length).toBe(3);
  });
});
