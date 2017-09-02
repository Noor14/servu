'use strict';

describe('Controller: getPhoneCtrl', function () {

  // load the controller's module
  beforeEach(module('servu'));

  var getPhoneCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    getPhoneCtrl = $controller('getPhoneCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(getPhoneCtrl.awesomeThings.length).toBe(3);
  });
});
