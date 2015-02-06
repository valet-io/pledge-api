'use strict';

var expect = require('chai').expect;

exports.assertStatus = function assertStatus (statusCode) {
  return function statusValidator (payload) {
    expect(payload.statusCode).to.equal(statusCode);
  }
}
