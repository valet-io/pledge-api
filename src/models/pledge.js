var Joi   = require('joi');
var _     = require('lodash');
var Model = require('../lib/model').Model;

var Pledge = Model.extend({
  tableName: 'pledges',

  initialize: function () {
    this.on('created', function (pledge) {
      return Pledge.triggerThen('created', pledge)
        .catch(console.log);
    });
  },

  schema: {
    id: Joi.number().integer().min(0),
    amount: Joi.number().integer().min(1).required(),
    anonymous: Joi.boolean(),
    donor_id: Joi.number().integer().min(0).required(),
    campaign_id: Joi.number().integer().min(0).required(),
    payment_id: Joi.number().integer().min(0),
    started_at: Joi.date(),
    submitted_at: Joi.date()
  },

  campaign: function () {
    return this.belongsTo(require('./campaign'));
  },

  donor: function () {
    return this.belongsTo(require('./donor'));
  },

  toFirebase: function () {
    return {
      donor_id: this.get('donor_id'),
      donor: {
        id: this.related('donor').get('id'),
        name: this.related('donor').get('name') || null
      },
      timestamp: this.get('created_at').getTime(),
      anonymous: this.get('anonymous') || null,
      amount: this.get('amount') || null
    };
  }
});

_.extend(Pledge, require('bookshelf/dialects/base/events').Events);

module.exports = Pledge;
