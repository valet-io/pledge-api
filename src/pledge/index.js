'use strict';

exports.register = function (server, options, next) {
  server.dependency(['db', 'campaign', 'donor']);
  server.expose('Pledge', require('./pledge')(server.plugins.db.bookshelf));
  require('./routes')(server);
  next();
};

exports.register.attributes = {
  name: 'pledge'
};
