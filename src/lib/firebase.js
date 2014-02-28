'use strict';

var Pledge = require('../models/pledge');

module.exports = function (Firebase) {

  var internals = {};

  internals.firebase = new Firebase('https://valet-io-events.firebaseio.com/campaigns/');

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
    var campaign = new internals.Campaign(pledge.related('campaign'));
    campaign.pledges.child(pledge.id).set(pledge.toFirebase());
    campaign.aggregtes.total.transaction(function (total) {
      return total + pledge.get('amount');
    });
    campaign.aggregates.count.transaction(function (count) {
      return count + 1;
    });
  });

  return;

};