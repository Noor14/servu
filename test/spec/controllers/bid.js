'use strict';

describe('Controller: BidCtrl', function () {

  // load the controller's module
  beforeEach(module('servu'));

  var BidCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BidCtrl = $controller('BidCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(BidCtrl.awesomeThings.length).toBe(3);
  });
});
