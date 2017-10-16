'use strict';

describe('Directive: settingPanel', function () {

  // load the directive's module
  beforeEach(module('servu'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<setting-panel></setting-panel>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the settingPanel directive');
  }));
});
