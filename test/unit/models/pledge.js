var expect = require('chai').expect;
var Pledge = require('../../../src/models/pledge');

describe('Pledge', function () {

  var pledge;
  beforeEach(function () {
    pledge = new Pledge();
  });

  it('provides a validation schema', function () {
    pledge.set({
      id: 0,
      amount: 1,
      donor_id: 0,
      campaign_id: 0,
      payment_id: 0,
      started_at: new Date(),
      submitted_at: new Date()
    });
    expect(pledge.validate()).to.be.null;
  });

});