'use strict';

exports.register = function (plugin, options, next) {
  plugin.dependency('db');
  plugin.expose('Organization', require('./organization')(plugin.plugins.db.bookshelf));
  plugin.expose('StripeUser', require('./stripe')(plugin.plugins.db.bookshelf));
  next();
};

exports.register.attributes = {
  name: 'organization'
};
