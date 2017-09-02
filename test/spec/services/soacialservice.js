'use strict';

describe('Service: socialService', function () {

  // load the service's module
  beforeEach(module('servu'));

  // instantiate service
  var socialService;
  beforeEach(inject(function (_socialService_) {
    socialService = _socialService_;
  }));

  it('should do something', function () {
    expect(!!socialService).toBe(true);
  });

});
