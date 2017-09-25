'use strict';

describe('Controller: EditjobcommentCtrl', function () {

  // load the controller's module
  beforeEach(module('servu'));

  var EditjobcommentCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditjobcommentCtrl = $controller('EditjobcommentCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EditjobcommentCtrl.awesomeThings.length).toBe(3);
  });
});
