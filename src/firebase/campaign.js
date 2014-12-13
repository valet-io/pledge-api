'use strict';

var Promise = require('bluebird');

module.exports = function (server) {
  var ref    = server.plugins.firebase.ref;
  var Campaign = server.plugins.campaign.Campaign;

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
