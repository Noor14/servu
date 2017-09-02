'use strict';

describe('Service: jobCategory', function () {

  // load the service's module
  beforeEach(module('servu'));

  // instantiate service
  var jobCategory;
  beforeEach(inject(function (_jobCategory_) {
    jobCategory = _jobCategory_;
  }));

  it('should do something', function () {
    expect(!!jobCategory).toBe(true);
  });

});
