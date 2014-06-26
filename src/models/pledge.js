'use strict';

var Joi       = require('joi');
var Model     = require('../lib/db').Model;
var Promise   = require('bluebird');
var internals = {};

internals.refs = function (pledge) {
  var campaign = pledge.related('campaign').firebase();
  return {
    pledge: campaign.child('pledges').child(pledge.id),
    total: campaign.child('aggregates').child('total'),
    count: campaign.child('aggregates').child('count')
  };
};

module.exports = Model.extend({
  tableName: 'pledges',

  schema: {
    id: Joi.string().guid(),
    amount: Joi.number().integer().min(1).required(),
    anonymous: Joi.boolean(),
    donor_id: Joi.string().guid().required(),
    campaign_id: Joi.string().guid().required(),
    payment_id: Joi.string(),
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
        name: this.related('donor').get('name')
      },
      created_at: this.get('created_at').getTime(),
      anonymous: this.get('anonymous') || null,
      amount: this.get('amount')
    };
  }
})
.on('created', function (pledge) {
  return pledge
    .load(['campaign', 'donor'])
    .then(function (pledge) {
      var refs = internals.refs(pledge);
      return Promise.promisify(refs.pledge.set, refs.pledge)(pledge.toFirebase())
        .then(function () {
          return Promise.all([
            Promise.promisify(refs.total.transaction, refs.total)(function (total) {
              return total + pledge.get('amount');
            }),
            Promise.promisify(refs.count.transaction, refs.count)(function (count) {
              return count + 1;
            })
          ]);
        });
    });
});
