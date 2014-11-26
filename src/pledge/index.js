'use strict';

exports.register = function (plugin, options, next) {
  plugin.config.route.prefix = '/pledges';
  plugin.dependency(['db', 'campaign', 'donor']);
  plugin.expose('Pledge', require('./pledge')(plugin.plugins.db.bookshelf));
  require('./routes')(plugin);
  next();
};

exports.register.attributes = {
  name: 'pledge'
};
