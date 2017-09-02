'use strict';

describe('Service: documentService', function () {

  // load the service's module
  beforeEach(module('servu'));

  // instantiate service
  var documentService;
  beforeEach(inject(function (_documentService_) {
    documentService = _documentService_;
  }));

  it('should do something', function () {
    expect(!!documentService).toBe(true);
  });

});
