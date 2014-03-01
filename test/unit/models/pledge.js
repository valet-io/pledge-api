var expect = require('chai').expect;
var Pledge = require('../../../src/models/pledge');
var Donor  = require('../../../src/models/donor');

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
    return pledge.validate();
  });

  describe('#toFirebase', function () {

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

  describe('#donor', function () {

    it('belongsTo a donor', function () {
      return new Donor()
        .save(null, {validate: false})
        .bind({})
        .then(function (donor) {
          this.donor = donor;
          return new Pledge({donor_id: donor.id}).save(null, {validate: false});
        })
        .then(function (pledge) {
          return pledge.load('donor');
        })
        .then(function (pledge) {
          expect(pledge.related('donor')).to.have.property('id', this.donor.id);
        });
    });
    
  });

});