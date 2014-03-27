'use strict';

describe('Service: Identityservice', function () {

  // load the service's module
  beforeEach(module('garbledApp'));

  // instantiate service
  var Identityservice;
  beforeEach(inject(function (_Identityservice_) {
    Identityservice = _Identityservice_;
  }));

  it('should do something', function () {
    expect(!!Identityservice).toBe(true);
  });

});
