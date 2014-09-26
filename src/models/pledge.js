'use strict';

var Joi       = require('joi');
var Model     = require('../db').Model;
var Promise   = require('bluebird');
var knex      = require('../db').knex;
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
    created_at: Joi.date(),
    updated_at: Joi.date(),
    amount: Joi.number().integer().min(1).required(),
    anonymous: Joi.boolean().default(false),
    donor_id: Joi.string().guid().required(),
    campaign_id: Joi.string().guid().required(),
    payment_id: Joi.string().guid(),
    started_at: Joi.date().allow(null),
    submitted_at: Joi.date().allow(null),
    cancelled: Joi.boolean().default(false),
    cancelled_reason: Joi.string().valid('fake','abandoned', 'donor_request', 'bad_contact_info', 'duplicate').allow(null)
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
}, {
  paid: function (isPaid) {
    if (typeof isPaid === 'undefined') isPaid = true;
    return this.collection().query(function (qb) {
      qb.join('campaigns', 'campaigns.id', 'pledges.campaign_id')
        .where('campaigns.payments', true);
      var join;
      if (isPaid) {
        join = 'innerJoin';
      }
      else {
        join = 'leftOuterJoin';
      }
      qb[join]('payments', function () {
        this.on('pledges.id', 'payments.pledge_id')
            .on('payments.paid', knex.raw(true));
      });
      if (!isPaid) {
        qb.whereNull('payments.id');
      }
    });
  }
})
.on('created', function (pledge) {
  return pledge
    .load(['campaign', 'donor'])
    .then(function (pledge) {
      var refs = internals.refs(pledge);
      var toFirebase = pledge.toFirebase();
      return Promise.promisify(refs.pledge.setWithPriority, refs.pledge)(toFirebase, toFirebase.created_at)
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
