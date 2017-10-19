'use strict';

describe('Controller: editProfileCtrl', function () {

  // load the controller's module
  beforeEach(module('servu'));

  var editProfileCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    editProfileCtrl = $controller('editProfileCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(editProfileCtrl.awesomeThings.length).toBe(3);
  });
});
