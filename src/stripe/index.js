'use strict';

exports.register = function (server, options, next) {
  server.dependency('db');
  server.expose('ConnectUser', require('./user')(server.plugins.db.bookshelf));
  server.expose('stripe', require('./stripe'));
  server.method('stripe.key', require('./key')(server));
  require('./routes')(server);
  next();
};

exports.register.attributes = {
  name: 'stripe'
};
