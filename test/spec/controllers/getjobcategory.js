'use strict';

describe('Controller: getjobCategoryCtrl', function () {

  // load the controller's module
  beforeEach(module('servu'));

  var getjobCategoryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    getjobCategoryCtrl = $controller('getjobCategoryCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(getjobCategoryCtrl.awesomeThings.length).toBe(3);
  });
});
