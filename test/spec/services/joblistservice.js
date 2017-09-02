'use strict';

describe('Service: jobListService', function () {

  // load the service's module
  beforeEach(module('servu'));

  // instantiate service
  var jobListService;
  beforeEach(inject(function (_jobListService_) {
    jobListService = _jobListService_;
  }));

  it('should do something', function () {
    expect(!!jobListService).toBe(true);
  });

});
