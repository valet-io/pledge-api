'use strict';

exports.register = function (server, options, next) {
  server.dependency('db');
  server.expose('Domain', require('./domain')(server.plugins.db.bookshelf));
  server.expose('Registration', require('./registration')(server.plugins.db.bookshelf));
  next();
};

exports.register.attributes = {
  name: 'domain'
};
