'use strict';

var expect       = require('chai').expect;
var sinon        = require('sinon');
var uuid         = require('node-uuid');
var MockFirebase = require('mockfirebase').MockFirebase;
var Pledge       = require('../../../src/models/pledge');
var Donor        = require('../../../src/models/donor');

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

  describe('Relations', function () {

    it('belongsTo a Campaign', function () {
      pledge.set('campaign_id', 0);
      expect(pledge.campaign())
        .to.have.deep.property('relatedData.parentFk', 0);
    });

    it('belongsTo a Donor', function () {
      pledge.set('donor_id', 0);
      expect(pledge.donor())
        .to.have.deep.property('relatedData.parentFk', 0);
    });

  });

  describe('#paid', function () {

    it('returns a collection', function () {
      expect(Pledge.paid()).to.be.an.instanceOf(Pledge.prototype.Collection);
    });

    it('can query for paid pledges by default', function () {
      expect(Pledge.paid().query().toString())
        .to.equal(
          'select "pledges".* ' + 
          'from "pledges" ' +
          'inner join "payments" ' +
          'on "pledges"."id" = "payments"."pledge_id" ' +
          'and "payments"."paid" = "true"'
        )
        .and.to.equal(Pledge.paid(true).query().toString());
    });

    it('can query for unpaid pledges', function () {
      expect(Pledge.paid(false).query().toString())
        .to.equal(
          'select "pledges".* ' + 
          'from "pledges" ' +
          'left outer join "payments" ' +
          'on "pledges"."id" = "payments"."pledge_id" ' +
          'and "payments"."paid" = "true" ' +
          'where "payments"."id" is null'
        );
    });

  });

  describe('firebase sync', function () {

    var firebase, data, campaign;
    beforeEach(function () {
      firebase = new MockFirebase('campaign').autoFlush();
      sinon.stub(pledge, 'related')
        .withArgs('campaign').returns({
          firebase: sinon.stub().returns(firebase)
        })
        .withArgs('donor').returns(Donor.forge({
          id: uuid.v4(),
          name: 'Ben Drucker'
        }));
      sinon.stub(pledge, 'load').resolves(pledge);
      pledge.set(pledge.timestamp());
      pledge.set('id', uuid.v4());
      pledge.set('amount', 100);
      return Pledge.triggerThen('created', pledge)
        .then(function () {
          data = firebase.getData();
        });
    });

    it('saves the pledge to firebase', function () {
      expect(data).to.have.property('pledges')
        .with.property(pledge.id)
        .that.deep.equals(pledge.toFirebase());
    });

    it('uses the timestamp as the firebase priority', function () {
      expect(firebase.child('pledges').child(pledge.id))
        .to.have.property('priority', pledge.get('created_at').getTime());
    });

    it('increments the total by the pledge amount', function () {
      expect(data).to.have.deep.property('aggregates.total')
        .that.equals(100);
    });

    it('increments the count', function () {
      expect(data).to.have.deep.property('aggregates.count')
        .that.equals(1);
    });
    
  });

});
