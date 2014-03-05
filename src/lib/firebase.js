'use strict';

var Promise = require('bluebird');
var Pledge  = require('../models/pledge');

module.exports = function (Firebase) {

  var internals = {};

  internals.firebase = new Firebase('https://valet-io-events.firebaseio.com/campaigns');

  internals.Campaign = function (campaign) {
    var campaignRef = internals.firebase.child(campaign.id);
    return {
      pledges: campaignRef.child('pledges'),
      aggregates: {
        total: campaignRef.child('aggregates/total'),
        count: campaignRef.child('aggregates/count')
      }
    };
  };

  Pledge.on('created', function (pledge) {
    return pledge
      .load(['campaign', 'donor'])
      .then(function (pledge) {
        var campaign = internals.Campaign(pledge.related('campaign'));
        var firePledge = campaign.pledges.child(pledge.id);
        return Promise.promisify(firePledge.set, firePledge)(pledge.toFirebase())
          .then(function () {
            return Promise.all([
              Promise.promisify(campaign.aggregates.total.transaction, campaign.aggregates.total)(function (total) {
                return total + pledge.get('amount');
              }),
              Promise.promisify(campaign.aggregates.count.transaction, campaign.aggregates.count)(function (count) {
                return count + 1;
              })
            ]);
          });
      });
  });

};