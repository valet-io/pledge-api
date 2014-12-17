'use strict';

exports.register = function (server, options, next) {
  server.dependency(['db', 'pledge', 'stripe']);
  server.expose('Payment', require('./payment')(server.plugins.db.bookshelf, server));
  require('./routes')(server);
  next();
};

exports.register.attributes = {
  name: 'payment'
};
