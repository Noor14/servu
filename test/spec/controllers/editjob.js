'use strict';

describe('Controller: EditjobCtrl', function () {

  // load the controller's module
  beforeEach(module('servu'));

  var EditjobCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditjobCtrl = $controller('EditjobCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EditjobCtrl.awesomeThings.length).toBe(3);
  });
});
