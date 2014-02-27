var expect = require('chai').expect;
var DB     = require('../../../src/lib/db');

describe('Database', function () {

  it('uses the registry plugin', function () {
    expect(DB).to.itself.respondTo('model');
  });

});