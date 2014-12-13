'use strict';

var Firebase = require('firebase');
var Promise  = require('bluebird');

Promise.promisifyAll(Firebase.prototype);

exports.register = function (server, options, next) {
  server.dependency(['campaign', 'pledge']);
  server.expose('ref', new Firebase(server.settings.app.config.get('firebase.endpoint')));
  require('./campaign')(server);
  require('./pledge')(server);
  server.after(require('./auth'));
  next();
};

exports.register.attributes = {
  name: 'firebase'
};
