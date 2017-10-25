'use strict';

describe('Controller: myJobCtrl', function () {

  // load the controller's module
  beforeEach(module('servu'));

  var myJobCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    myJobCtrl = $controller('myJobCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(myJobCtrl.awesomeThings.length).toBe(3);
  });
});
