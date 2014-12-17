'use strict';

module.exports = function (server) {
  return function stripeKey (organization, live, next) {
    var key;
    if (organization.get('connect')) {
      var connect = organization.related('stripe');
      key = live ? connect.get('stripe_access_token') : connect.get('stripe_test_access_token');
    }
    else {
      var config = server.settings.app.config;
      key = live ? config.get('stripe.key') : config.get('stripe.test_key');
    }
    return next(null, key);
  };
};
