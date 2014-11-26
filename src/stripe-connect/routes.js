'use strict';

var config = require('../../config');
var crypto = require('crypto');
var wreck  = require('wreck');
var qs     = require('qs');
var boom   = require('boom');
var schema = require('./schema');

module.exports = function (plugin) {
  var StripeUser = plugin.plugins.organization.StripeUser;
  plugin.route([
    {
      method: 'GET',
      path: '/callback',
      handler: function (request, reply) {
        reply.redirect('/success');
      },
      config: {
        validate: {
          query: schema.callback
        },
        pre: [
          [{
            method: handleError
          }],
          [
            {
              method: decrypt,
              assign: 'organization_id'
            },
            {
              method: authorize,
              assign: 'stripe'
            }
          ],
          [{
            method: save
          }]
        ]
      }
    },
    {
      method: 'GET',
      path: '/success',
      handler: function (request, reply) {
        reply('Success! Your Stripe account is configured.');
      }
    }
  ]);
  function save (request, reply) {
    new StripeUser({
      organization_id: request.pre.organization_id,
      stripe_user_id: request.pre.stripe.stripe_user_id,
      stripe_access_token: request.pre.stripe.access_token,
      stripe_refresh_token: request.pre.stripe.refresh_token,
      stripe_publishable_key: request.pre.stripe.stripe_publishable_key
    })
    .save(null, {
      method: 'insert'
    })
    .then(reply)
    .catch(reply);
  }
};

function handleError (request, reply) {
  if (request.query.error) {
    if (request.query.error === 'access_denied') {
      return reply(boom.unauthorized('User denied Stripe authorization'));
    }
    else {
      var err = new Error(request.query.error_description || 'Stripe error');
      err.code = request.query.error;
      return reply(err);
    }
  }
  reply();
}

// TODO: validate uuid with joi before authorizing
function decrypt (request, reply) {
  var decipher = crypto.createDecipher('aes256', config.get('stripe:key'));
  var decrypted = decipher.update(request.query.state, 'hex', 'utf8') + decipher.final('utf8');
  reply(decrypted);
}

function authorize (request, reply) {
  wreck.post('https://connect.stripe.com/oauth/token', {
    payload: qs.stringify({
      client_secret: config.get('stripe:key'),
      grant_type: 'authorization_code',
      code: request.query.code
    }),
    json: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }, function (err, res, payload) {
    if (err) return reply(err);
    if (res.statusCode >= 400) {
      err = new Error(payload.error_description || 'Unknown error');
      err.code = payload.error;
      return reply(err);
    }
    else {
      return reply(payload);
    }
  });
}
