'use strict';

describe('Service: Storagelogin', function () {

  // load the service's module
  beforeEach(module('garbledApp'));

  // instantiate service
  var Storagelogin;
  beforeEach(inject(function (_Storagelogin_) {
    Storagelogin = _Storagelogin_;
  }));

  it('should do something', function () {
    expect(!!Storagelogin).toBe(true);
  });

});
