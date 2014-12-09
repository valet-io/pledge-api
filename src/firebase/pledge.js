'use strict';

var Promise = require('bluebird');

module.exports = function (plugin) {
  var ref    = plugin.plugins.firebase.ref;
  var Pledge = plugin.plugins.pledge.Pledge;

  function generateRefs (pledge) {
    var campaign   = ref.child('campaigns').child(pledge.get('campaign_id'));
    var aggregates = campaign.child('aggregates');
    return {
      pledge: campaign.child('pledges').child(pledge.id),
      total: aggregates.child('total'),
      count: aggregates.child('count')
    };
  }

  Pledge
    .on('created', function (pledge) {
      return pledge
        .load(['donor'])
        .then(function (pledge) {
          var refs = generateRefs(pledge);
          var data = pledge.toFirebase();
          return Promise.join(
            refs.pledge.setWithPriorityAsync(data, data.created_at),
            refs.total.transactionAsync(function (total) {
              return total + data.amount;
            }),
            refs.count.transactionAsync(function (count) {
              return count + 1;
            })
          );
        });
    })
    .on('updated', function (pledge) {
      var refs = generateRefs(pledge);
      return Promise.join(
        refs.pledge.child('amount').setAsync(pledge.get('amount')),
        refs.total.transactionAsync(function (total) {
          return total + pledge.get('amount');
        })
      );
    });
};
