'use strict';

var Joi         = require('joi');
var Promise     = require('bluebird');
var _           = require('lodash');
var createError = require('create-error');
var Model       = require('../db').Model;
var config      = require('../../config');

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
      paid: Joi.boolean()
    }),

  stripe: require('stripe')(config.get('stripe:key')),

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
          .save()
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
          .save();
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
