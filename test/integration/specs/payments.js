'use strict';

var expect  = require('chai').expect;
var uuid    = require('node-uuid');
var server  = require('../../server');
var stripe  = require('../../../src/models/payment').prototype.stripe;

describe('Payments', function () {

  var pledge = require('../seeds/pledges')[0];

  this.timeout(10000);

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
            amount: 100,
            pledge_id: pledge.id,
            token: token.id
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
          amount: 100,
          pledge_id: pledge.id,
          token: ''
        })
      })
      .then(function (response) {
        expect(response.statusCode).to.equal(400);
      });
    });

    it('passes through processing errors', function () {
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
            amount: 100,
            pledge_id: pledge.id,
            token: token.id
          })
        });
      })
      .then(function (response) {
        expect(response.statusCode).to.equal(402);
        expect(response.result.error).to.equal('Card Error');
        expect(response.result.message).to.equal('Your card was declined.');
      });
    });

  });

});
