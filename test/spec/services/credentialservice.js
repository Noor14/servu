'use strict';

describe('Service: credentialService', function () {

  // load the service's module
  beforeEach(module('servu'));

  // instantiate service
  var credentialService;
  beforeEach(inject(function (_credentialService_) {
    credentialService = _credentialService_;
  }));

  it('should do something', function () {
    expect(!!credentialService).toBe(true);
  });

});
