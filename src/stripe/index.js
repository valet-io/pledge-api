'use strict';

exports.register = function (plugin, options, next) {
  plugin.config.route.vhost = ['stripe.valet.io', 'stripe-staging.valet.io', 'localhost'];
  plugin.dependency('db');
  plugin.expose('ConnectUser', require('./user')(plugin.plugins.db.bookshelf));
  plugin.expose('stripe', require('./stripe'));
  require('./routes')(plugin);
  next();
};

exports.register.attributes = {
  name: 'stripe'
};
