'use strict';

var Joi     = require('joi');
var Promise = require('bluebird');
var Model   = require('../db').Model;
var config  = require('../../config');

var Payment = Model.extend({
  tableName: 'payments',

  schema: {
    id: Joi.string().guid(),
    amount: Joi.number().integer().min(1),
    pledge_id: Joi.string().guid().required(),
    provider_name: Joi.string().valid('stripe'),
    provider_id: Joi.string()
  },

  stripe: require('stripe')(config.get('stripe:key')),

  charge: function (token) {
    var payment = this;
    return Promise.resolve(payment.stripe.charges.create({
      amount: this.get('amount') * 100,
      currency: 'usd',
      card: token
    })
    .then(function (charge) {
      return payment.set({
        provider_name: 'stripe',
        provider_id: charge.id
      })
      .save();
    }));
  }

});

module.exports = Payment;
