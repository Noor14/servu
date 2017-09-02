'use strict';

describe('Controller: dashboardCtrl', function () {

  // load the controller's module
  beforeEach(module('servu'));

  var dashboardCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    dashboardCtrl = $controller('dashboardCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(dashboardCtrl.awesomeThings.length).toBe(3);
  });
});
