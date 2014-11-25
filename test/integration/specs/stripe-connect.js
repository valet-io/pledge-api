'use strict';

var expect     = require('chai').expect;
var crypto     = require('crypto');
var nock       = require('nock');
var StripeUser = require('../../../src/organization/stripe');
var server     = require('../../server');
var config     = require('../../../config');

describe('Stripe Connect', function () {

  var organization = require('../seeds/organizations')[0];

  describe('GET /callback', function () {

    it('is not accessible from the main API', function () {
      return server.injectThen('/callback')
        .then(function (response) {
          expect(response.statusCode).to.equal(404);
        });
    });

    it('can handle access_denied', function () {
      return server.injectThen({
        url: '/callback?error=access_denied',
        headers: {
          host: 'stripe.valet.io'
        }
      })
      .then(function (response) {
        expect(response.statusCode).to.equal(401);
      });
    });

    it('can handle other errors', function () {
      return server.injectThen({
        url: '/callback?error=invalid_scope',
        headers: {
          host: 'stripe.valet.io'
        }
      })
      .then(function (response) {
        expect(response.statusCode).to.equal(500);
      });
    });

    it('can handle other errors', function () {
      return server.injectThen({
        url: '/callback?error=invalid_scope',
        headers: {
          host: 'stripe.valet.io'
        }
      })
      .then(function (response) {
        expect(response.statusCode).to.equal(500);
      });
    });

    it('can authorize an organization for Stripe', function () {
      var secret  = config.get('stripe:key');
      var cipher  = crypto.createCipher('aes256', secret);
      var state   = cipher.update(organization.id, 'utf8', 'hex') + cipher.final('hex');
      nock('https://connect.stripe.com')
        .post('/oauth/token')
        .reply(200, {
          access_token: 'aToken',
          scope: 'read_write',
          livemode: false,
          token_type: 'bearer',
          refresh_token: 'rToken',
          stripe_user_id: 'sId',
          stripe_publishable_key: 'sPk'
        });
      return server.injectThen({
        url: '/callback?code=authCode&scope=read_write&state=' + state,
        headers: {
          host: 'stripe.valet.io'
        }
      })
      .then(function (response) {
        expect(response.statusCode).to.equal(302);
        return new StripeUser({
          organization_id: organization.id
        })
        .fetch({require: true});
      })
      .then(function (user) {
        expect(user.toJSON()).to.contain({
          organization_id: organization.id,
          stripe_user_id: 'sId',
          stripe_access_token: 'aToken',
          stripe_refresh_token: 'rToken',
          stripe_publishable_key: 'sPk'
        });
      })
      .finally(function () {
        nock.cleanAll();
      });
    });

  });

});
