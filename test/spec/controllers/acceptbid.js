'use strict';

describe('Controller: acceptBidCtrl', function () {

  // load the controller's module
  beforeEach(module('servu'));

  var acceptBidCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    acceptBidCtrl = $controller('acceptBidCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(acceptBidCtrl.awesomeThings.length).toBe(3);
  });
});
