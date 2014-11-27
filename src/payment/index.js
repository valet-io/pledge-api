'use strict';

exports.register = function (plugin, options, next) {
  plugin.config.route.prefix = '/payments';
  plugin.dependency(['db', 'pledge', 'stripe']);
  plugin.expose('Payment', require('./payment')(plugin.plugins.db.bookshelf, plugin.plugins.stripe.stripe));
  require('./routes')(plugin);
  next();
};

exports.register.attributes = {
  name: 'payment'
};
