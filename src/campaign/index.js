'use strict';

exports.register = function (plugin, options, next) {
  plugin.config.route.prefix = '/campaigns';
  plugin.dependency(['db', 'organization']);
  plugin.expose('Campaign', require('./campaign')(plugin.plugins.db.bookshelf));
  require('./routes')(plugin);
  next();
};

exports.register.attributes = {
  name: 'campaign'
};
