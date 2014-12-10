'use strict';

var Firebase = require('firebase');
var Promise  = require('bluebird');

Promise.promisifyAll(Firebase.prototype);

exports.register = function (plugin, options, next) {
  plugin.dependency(['campaign', 'pledge']);
  plugin.expose('ref', new Firebase(plugin.app.config.get('firebase.endpoint')));
  require('./campaign')(plugin);
  require('./pledge')(plugin);
  plugin.after(require('./auth'));
  next();
};

exports.register.attributes = {
  name: 'firebase'
};
