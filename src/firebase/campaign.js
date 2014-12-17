'use strict';

var Promise = require('bluebird');

module.exports = function (server) {
  var ref    = server.plugins.firebase.ref;
  var Campaign = server.plugins.campaign.Campaign;

  var defaults = {
    aggregates: {
      total: 0,
      count: 0
    },
    options: {
      starting_value: 0
    }
  };

  Campaign.on('created', function (campaign) {
    return ref.child('campaigns').child(campaign.id).setAsync({
      live: defaults,
      test: defaults
    });
  });
};
