'use strict';

exports.register = function (plugin, options, next) {
  plugin.config.route.prefix = '/donors';
  plugin.dependency('db');
  plugin.expose('Donor', require('./donor')(plugin.plugins.db.bookshelf))
  require('./routes')(plugin);
  next();
};

exports.register.attributes = {
  name: 'donor'
};
