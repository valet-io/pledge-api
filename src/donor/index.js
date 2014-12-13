'use strict';

exports.register = function (server, options, next) {
  server.dependency('db');
  server.expose('Donor', require('./donor')(server.plugins.db.bookshelf));
  require('./routes')(server);
  next();
};

exports.register.attributes = {
  name: 'donor'
};
