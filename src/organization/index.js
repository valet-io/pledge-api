'use strict';

exports.register = function (plugin, options, next) {
  plugin.dependency(['db', 'stripe']);
  plugin.expose('Organization', require('./organization')(plugin.plugins.db.bookshelf));
  next();
};

exports.register.attributes = {
  name: 'organization'
};
