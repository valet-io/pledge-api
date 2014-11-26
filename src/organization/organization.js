'use strict';

var Joi = require('joi');

module.exports = function (bookshelf) {
  return bookshelf.model('Organization', bookshelf.Model.extend({
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
      var data = bookshelf.Model.prototype.toJSON.apply(this, arguments);
      if (data.stripe) {
        data.stripe = {
          publishable_key: data.stripe.stripe_publishable_key
        };
      }
      return data;
    }

  }));
};
