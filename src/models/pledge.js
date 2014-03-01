var Joi   = require('joi');
var _     = require('lodash');
var Model = require('../lib/model').Model;

var Pledge = Model.extend({
  tableName: 'pledges',

  schema: {
    id: Joi.number().integer().min(0).required(),
    amount: Joi.number().integer().min(1).required(),
    donor_id: Joi.number().integer().min(0).required(),
    campaign_id: Joi.number().integer().min(0).required(),
    payment_id: Joi.number().integer().min(0),
    started_at: Joi.date(),
    submitted_at: Joi.date()
  },

  donor: function () {
    return this.hasOne(require('./donor'));
  },

  toFirebase: function () {
    return {
      donor: {
        name: this.related('donor').get('name')
      },
      anonymous: this.get('anonymous'),
      amount: this.get('amount')
    };
  }
});

_.extend(Pledge, require('bookshelf/dialects/base/events').Events);

module.exports = Pledge;