'use strict';

var Joi         = require('joi');
var Promise     = require('bluebird');
var _           = require('lodash');
var createError = require('create-error');

var addressFields = ['street1', 'street2', 'zip', 'city', 'state'];

module.exports = function (bookshelf, server) {
  var stripe = server.plugins.stripe.stripe;
  Promise.promisifyAll(server.methods.stripe);
  var Payment = bookshelf.Model.extend({
    tableName: 'payments',

    schema: Joi
      .object()
      .keys({
        id: Joi.string().guid(),
        created_at: Joi.date(),
        updated_at: Joi.date(),
        token: Joi.string(),
        amount: Joi.number().integer().min(1),
        pledge_id: Joi.string().guid().required(),
        provider_name: Joi.string().valid('stripe'),
        provider_id: Joi.string(),
        paid: Joi.boolean(),
        processed: Joi.boolean(),
        address: Joi.object().required().keys({
          street1: Joi.string().required(),
          street2: Joi.string().allow(''),
          zip: Joi.string().required(),
          city: Joi.string(),
          state: Joi.string()
        }),
        live: Joi.boolean().default(true)
      }),

    parse: function (attributes) {
      attributes.address = {};
      addressFields.forEach(function (field) {
        attributes.address[field] = attributes['address_' + field];
        delete attributes['address_' + field];
      });
      return attributes;
    },

    format: function (attributes) {
      if (attributes.address) {
        addressFields.forEach(function (field) {
          attributes['address_' + field] = attributes.address[field];
        });
        delete attributes.address;
      }
      return attributes;
    },

    virtuals: {
      processed: function () {
        return !!this.get('provider_id');
      }
    },

    charge: function (token) {
      return Promise
        .bind(this)
        .then(function () {
          return this.load(['pledge.donor', 'pledge.campaign.organization.stripe']);
        })
        .then(function (payment) {
          var charge = {
            amount: payment.get('amount') * 100,
            description: 'Donation',
            statement_description: 'Donation',
            currency: 'usd',
            card: token,
            metadata: {
              pledge_id: payment.related('pledge').id,
              pledge_created_at: payment.related('pledge').get('created_at'),
              donor_id: payment.related('pledge').related('donor').id,
              donor_email: payment.related('pledge').related('donor').get('email'),
              donor_phone: payment.related('pledge').related('donor').get('phone')
            }
          };
          var organization = payment.related('pledge').related('campaign').related('organization');
          return server.methods.stripe.keyAsync(organization, payment.get('live'))
            .then(function (key) {
              return stripe.charges.create(charge, key);
            });
        })
        .finally(function () {
          this.set('provider_name', 'stripe');
        })
        .catch(function (err) {
          return err.type && err.type === 'StripeCardError';
        },
        function (err) {
          throw _.extend(new Payment.CardError(err.message), {
            provider_id: err.raw && err.raw.charge,
            code: err.code
          });
        })
        .catch(Payment.CardError, function (err) {
          return this
            .set({
              provider_id: err.provider_id,
              paid: false
            })
            .save(null, {method: 'insert'})
            .then(function (payment) {
              err.id = payment.id;
            })
            .throw(err);
        })
        .then(function (charge) {
          return this
            .set({
              provider_id: charge.id,
              paid: true
            })
            .save(null, {method: 'insert'});
        });
    },


    pledge: function () {
      return this.belongsTo('Pledge');
    }

  },
  {
    CardError: createError('Card Error')
  });
  return bookshelf.model('Payment', Payment);
};
