'use strict';

exports.register = function (server, options, next) {
  server.dependency(['db', 'organization']);
  server.expose('Campaign', require('./campaign')(server.plugins.db.bookshelf));
  require('./routes')(server);
  next();
};

exports.register.attributes = {
  name: 'campaign'
};
