'use strict';

var Joi       = require('joi');
var Promise   = require('bluebird');

module.exports = function (bookshelf) {
  return bookshelf.model('Pledge', bookshelf.Model.extend({
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
      cancelled_reason: Joi.string().valid('fake','abandoned', 'donor_request', 'bad_contact_info', 'duplicate').allow(null),
      live: Joi.boolean().default(true)
    },

    campaign: function () {
      return this.belongsTo('Campaign');
    },

    donor: function () {
      return this.belongsTo('Donor');
    },

    toFirebase: function () {
      return {
        id: this.id,
        donor_id: this.get('donor_id'),
        donor: {
          id: this.related('donor').get('id'),
          name: this.related('donor').get('name')
        },
        created_at: this.get('created_at').getTime(),
        anonymous: this.get('anonymous') || null,
        amount: this.get('amount')
      };
    },
    paid: function (isPaid) {
      if (typeof isPaid === 'undefined') isPaid = true;
      return this.query(function (qb) {
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
              .on('payments.paid', bookshelf.knex.raw(true));
        });
        if (!isPaid) {
          qb.whereNull('payments.id');
        }
      });
    }
  }));
};

function generateRefs (pledge) {
  var campaign = pledge.related('campaign').firebase();
  return {
    pledge: campaign.child('pledges').child(pledge.id),
    total: campaign.child('aggregates').child('total'),
    count: campaign.child('aggregates').child('count')
  };
}
