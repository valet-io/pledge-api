'use strict';

exports.register = function (server, options, next) {
  server.dependency(['db', 'stripe']);
  server.expose('Organization', require('./organization')(server.plugins.db.bookshelf));
  next();
};

exports.register.attributes = {
  name: 'organization'
};
