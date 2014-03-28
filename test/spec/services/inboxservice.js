'use strict';

describe('Service: Inboxservice', function () {

  // load the service's module
  beforeEach(module('garbledApp'));

  // instantiate service
  var Inboxservice;
  beforeEach(inject(function (_Inboxservice_) {
    Inboxservice = _Inboxservice_;
  }));

  it('should do something', function () {
    expect(!!Inboxservice).toBe(true);
  });

});
