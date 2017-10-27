'use strict';

describe('Controller: addSkillCtrl', function () {

  // load the controller's module
  beforeEach(module('servu'));

  var addSkillCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    addSkillCtrl = $controller('addSkillCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(addSkillCtrl.awesomeThings.length).toBe(3);
  });
});
