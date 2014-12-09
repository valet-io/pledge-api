'use strict';

var Promise = require('bluebird');

module.exports = function (plugin) {
  var ref    = plugin.plugins.firebase.ref;
  var Campaign = plugin.plugins.campaign.Campaign;

  Campaign.on('created', function (campaign) {
    return ref.child('campaigns').child(campaign.id).setAsync({
      aggregates: {
        total: 0,
        count: 0
      },
      options: {
        starting_value: 0
      }
    });
  });
};
