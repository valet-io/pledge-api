'use strict';

var expect  = require('chai').expect;
var _       = require('lodash');
var sinon   = require('sinon');
var Promise = require('bluebird');

module.exports = function (Payment, stripe) {

  describe('Payment', function () {

    var payment;
    beforeEach(function () {
      payment = new Payment();
    });

    it('defines a read-only virtual property "processed"', function () {
      expect(payment.get('processed')).to.be.false;
      expect(payment.set('provider_id', '123').get('processed')).to.be.true;
      expect(payment.set.bind(payment, 'processed', false)).to.not.throw();
      expect(payment.get('processed')).to.be.true;
    });

    describe('#format', function () {

      it('snakifies the address properties', function () {
        expect(payment.format({
          address: {
            street1: '123 Main St',
            street2: 'Apt 1A',
            zip: '10230',
            city: 'Urbanville',
            state: 'NY'
          }
        }))
        .to.deep.equal({
          address_street1: '123 Main St',
          address_street2: 'Apt 1A',
          address_zip: '10230',
          address_city: 'Urbanville',
          address_state: 'NY'
        });
      });

    });

    describe('#parse', function () {

      it('object-ifies the address properties', function () {
        expect(payment.parse({
          address_street1: '123 Main St',
          address_street2: 'Apt 1A',
          address_zip: '10230',
          address_city: 'Urbanville',
          address_state: 'NY'
        }))
        .to.deep.equal({
          address: {
            street1: '123 Main St',
            street2: 'Apt 1A',
            zip: '10230',
            city: 'Urbanville',
            state: 'NY'
          }
        });
      });

    });

    describe('#charge', function () {

      var charge;
      beforeEach(function () {
        charge = {
          id: 'ch_123'
        };
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
        sinon.stub(payment, 'load').resolves(payment);
        var now = new Date();
        payment
          .set('amount', 1)
          .related('pledge')
          .set({
            id: 'pledgeId',
            created_at: now
          })
          .related('donor')
          .set({
            id: 'donorId',
            email: 'email',
            phone: '9739856070'
          });
        return payment.charge('token').then(function () {
          expect(payment.load).to.have.been.calledWithMatch([
            'pledge.donor',
            'pledge.campaign.organization.stripe'
          ]);
          expect(stripe.charges.create).to.have.been.calledWithMatch({
            amount: 100,
            currency: 'usd',
            description: 'Donation',
            statement_description: 'Donation',
            card: 'token',
            metadata: {
              pledge_id: 'pledgeId',
              pledge_created_at: now,
              donor_id: 'donorId',
              donor_email: 'email',
              donor_phone: '+19739856070'
            }
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

        var error, originalCreate;
        beforeEach(function () {
          error = _.extend(new Error('StripeError'), {
            type: 'StripeCardError',
            raw: {
              charge: 'ch_123'
            }
          });
          originalCreate = stripe.charges.create;
          stripe.charges.create = function () {
            return Promise.reject(error);
          };
        });

        afterEach(function () {
          stripe.charges.create = originalCreate;
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

};
