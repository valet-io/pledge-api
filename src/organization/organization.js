'use strict';

var Joi       = require('joi');
var bookshelf = require('../db');
var Model     = bookshelf.Model;

var Organization = Model.extend({
  tableName: 'organizations',

  schema: {
    id: Joi.string().guid(),
    name: Joi.string().required(),
    created_at: Joi.date(),
    updated_at: Joi.date()
  },

  stripe: function () {
    return this.hasOne('StripeUser');
  },

  toJSON: function () {
    var data = Model.prototype.toJSON.apply(this, arguments);
    if (data.stripe) {
      data.stripe = {
        publishable_key: data.stripe.stripe_publishable_key
      };
    }
    return data;
  }

});

module.exports = bookshelf.model('Organization', Organization);
