'use strict';

var expect  = require('chai').expect;
var uuid    = require('node-uuid');
var server  = require('../../server');
var stripe  = require('../../../src/models/payment').prototype.stripe;

describe('Payments', function () {

  var payment = require('../seeds/payments')[0];
  var pledge  = require('../seeds/pledges')[0];

  this.timeout(10000);

  describe('GET /pledges/{id}', function () {

    it('gets the payment by ID', function () {
      return server.injectThen('/payments/' + payment.id)
        .then(function (response) {
          expect(response.statusCode).to.equal(200);
          expect(response.result.id).to.equal(payment.id);
        });
    });

    it('can get the payment with related data', function () {
      return server.injectThen('/payments/' + payment.id + '?expand[0]=pledge')
        .then(function (response) {
          expect(response.statusCode).to.equal(200);
          var payload = JSON.parse(response.payload);
          expect(payload)
            .to.have.property('pledge')
            .with.property('id', pledge.id);
        });
    });

    it('responds with a 400 for non-uuid', function () {
      return server.injectThen('/payments/1')
        .then(function (response) {
          expect(response.statusCode).to.equal(400);
        });
    });

    it('responds with 404 if the payment is not found', function () {
      return server.injectThen('/payments/' + uuid.v4())
        .then(function (response) {
          expect(response.statusCode).to.equal(404);
        });
    });

  });

  describe('POST /payments', function () {

    it('creates a payment', function () {
      return stripe.tokens.create({
        card: {
          'number': '4242424242424242',
          'exp_month': 12,
          'exp_year': 2015,
          'cvc': '123'
        }
      })
      .then(function (token) {
        return server.injectThen({
          url: '/payments',
          method: 'post',
          payload: JSON.stringify({
            id: uuid.v4(),
            amount: 100,
            pledge_id: pledge.id,
            token: token.id,
            address: {
              street1: '123 Main St',
              street2: 'Apt 1A',
              zip: '10001'
            }
          })
        });
      })
      .then(function (response) {
        expect(response.statusCode).to.equal(201);
        expect(response.result.get('id')).to.have.length(36);
        expect(response.result.get('provider_name')).to.equal('stripe');
        expect(response.result.get('token')).to.be.undefined;
        expect(response.result.get('provider_id'))
          .to.include('ch_')
          .and.have.length(17);
        expect(response.result.get('pledge_id')).to.equal(pledge.id);
      });
    });

    it('responds with 400 for an invalid token', function () {
      return server.injectThen({
        url: '/payments',
        method: 'post',
        payload: JSON.stringify({
          id: uuid.v4(),
          amount: 100,
          pledge_id: pledge.id,
          token: '',
          address: {
            street1: '123 Main St',
            street2: 'Apt 1A',
            zip: '10001'
          }
        })
      })
      .then(function (response) {
        expect(response.statusCode).to.equal(400);
      });
    });

    it('handles Stripe processing errors', function () {
      return stripe.tokens.create({
        card: {
          'number': '4000000000000002',
          'exp_month': 12,
          'exp_year': 2015,
          'cvc': '123'
        }
      })
      .then(function (token) {
        return server.injectThen({
          url: '/payments',
          method: 'post',
          payload: JSON.stringify({
            id: uuid.v4(),
            amount: 100,
            pledge_id: pledge.id,
            token: token.id,
            address: {
              street1: '123 Main St',
              street2: 'Apt 1A',
              zip: '10001'
            }
          })
        });
      })
      .then(function (response) {
        expect(response.statusCode).to.equal(402);
        expect(response.result.error).to.equal('Card Error');
        expect(response.result.message).to.equal('Your card was declined.');
        expect(response.result.id).to.have.length(36);
      });
    });

  });

});
