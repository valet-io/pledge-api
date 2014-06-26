'use strict';

var server = require('../src/server');

server.pack.register({
  plugin: require('inject-then')
}, function (err) {
  if (err) throw err;
});

module.exports = server;
