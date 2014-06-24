var expect = require('chai').expect;
var sinon  = require('sinon');
var uuid   = require('node-uuid');
var Pledge = require('../../../src/models/pledge');


describe('Pledge', function () {

  var pledge;
  beforeEach(function () {
    pledge = new Pledge();
  });

  it('provides a validation schema', function () {
    pledge.set({
      id: uuid.v4(),
      amount: 1,
      anonymous: false,
      donor_id: uuid.v4(),
      campaign_id: uuid.v4(),
      payment_id: uuid.v4(),
      started_at: new Date(),
      submitted_at: new Date(),
    });
    return pledge.validate();
  });

  describe('#toFirebase', function () {

    beforeEach(function () {
      pledge.set(pledge.timestamp());
    });

    it('includes the donor name', function () {
      pledge.related('donor').set('name', 'Ben');
      expect(pledge.toFirebase()).to.have.deep.property('donor.name', 'Ben');
    });

    it('includes the anonymous flag', function () {
      pledge.set('anonymous', true);
      expect(pledge.toFirebase()).to.have.property('anonymous', true);
    });

    it('includes the pledge amount', function () {
      pledge.set('amount', 5);
      expect(pledge.toFirebase()).to.have.property('amount', 5);
    });

  });

});
