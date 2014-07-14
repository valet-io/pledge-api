'use strict';

var expect  = require('chai').expect;
var uuid    = require('node-uuid');
var _       = require('lodash');
var sinon   = require('sinon');
var Payment = require('../../../src/models/payment');

describe('Payment', function () {

  var payment;
  beforeEach(function () {
    payment = new Payment();
  });

  it('provides a validation schema', function () {
    payment.set({
      id: uuid.v4(),
      amount: 1,
      pledge_id: uuid.v4(),
      provider_name: 'stripe',
      provider_id: 'ch_123',
      paid: true
    });
    return payment.validate();
  });

  describe('#charge', function () {

    var charge, stripe;
    beforeEach(function () {
      charge = {
        id: 'ch_123'
      };
      stripe = payment.stripe;
      sinon.stub(stripe.charges, 'create').resolves(charge);
      sinon.stub(payment, 'save').resolves(payment);
    });

    afterEach(function () {
      stripe.charges.create.restore();
    });

    it('resolves the payment', function () {
      return expect(payment.charge()).to.eventually.equal(payment);
    });

    it('creates a stripe charge using the token', function () {
      payment.set('amount', 1);
      return payment.charge('token').then(function () {
        expect(stripe.charges.create).to.have.been.calledWithMatch({
          amount: 100,
          currency: 'usd',
          card: 'token'
        });
      });
    });

    it('sets the provider to stripe', function () {
      return payment.charge().then(function () {
        expect(payment.get('provider_name')).to.equal('stripe');
      });
    });

    it('saves the payment', function () {
      return payment.charge().then(function (payment) {
        expect(payment.get('provider_id')).to.equal(charge.id);
        expect(payment.get('paid')).to.be.true;
        expect(payment.save).to.have.been.called;
      });
    });

    describe('Error handling', function () {

      var error;
      beforeEach(function () {
        error = _.extend(new Error(), {
          type: 'StripeCardError',
          raw: {
            charge: 'ch_123'
          }
        });
        stripe.charges.create.rejects(error);
      });

      it('transforms stripe card errors into CardError', function () {
        return expect(payment.charge())
          .to.be.rejected
          .then(function (err) {
            expect(err).to.be.an.instanceOf(Payment.CardError);
            expect(err).to.have.property('provider_id', error.raw.charge);
          });
      });

      it('saves the failed payment and appends the id', function () {
        payment.id = 0;
        return expect(payment.charge())
          .to.be.rejected
          .then(function (err) {
            expect(payment.save).to.have.been.called;
            expect(payment.get('provider_id')).to.equal('ch_123');
            expect(payment.get('paid')).to.be.false;
            expect(err).to.have.a.property('id', payment.id);
          });
      });

    });

  });
  
});
