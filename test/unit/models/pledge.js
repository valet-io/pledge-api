var expect = require('chai').expect;
var sinon  = require('sinon');
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
      anonymous: false,
      donor_id: 0,
      campaign_id: 0,
      payment_id: 0,
      started_at: new Date(),
      submitted_at: new Date()
    });
    return pledge.validate();
  });

  describe('events', function () {

    describe('created', function () {

      it('fires the event on the constructor', function () {
        var spy = sinon.spy();
        Pledge.on('created', spy);
        return pledge.save(null, {validate: false}).then(function (pledge) {
          expect(spy).to.have.been.calledWith(pledge);
        });
      });

      it('ignores errors from the constructor', function () {
        var stub = sinon.stub().throws();
        Pledge.on('created', stub);
        return pledge.save(null, {validate: false});
      });

    });

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

});