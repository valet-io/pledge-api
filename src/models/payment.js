'use strict';

var Joi         = require('joi');
var Promise     = require('bluebird');
var _           = require('lodash');
var createError = require('create-error');
var Model       = require('../db').Model;
var config      = require('../../config');

var addressFields = ['street1', 'street2', 'zip'];

var Payment = Model.extend({
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
        street2: Joi.string(),
        zip: Joi.string()
      })
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

  stripe: require('stripe')(config.get('stripe:key')),

  virtuals: {
    processed: function () {
      return !!this.get('provider_id');
    }
  },

  charge: function (token) {
    return Promise
      .bind(this)
      .then(function () {
        return this.stripe.charges.create({
          amount: this.get('amount') * 100,
          currency: 'usd',
          card: token
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
          provider_id: err.raw && err.raw.charge
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
    return this.belongsTo(require('./pledge'));
  }

},
{
  CardError: createError('Card Error')
});

module.exports = Payment;
