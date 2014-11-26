'use strict';

exports.register = function (plugin, options, next) {
  plugin.config.route.vhost = ['stripe.valet.io', 'stripe-staging.valet.io', 'localhost'];
  plugin.dependency('organization');
  require('./routes')(plugin);
  next();
};

exports.register.attributes = {
  name: 'stripe-connect'
};
