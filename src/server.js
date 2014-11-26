'use strict';

var hapi   = require('hapi');
var config = require('../config');

var server = new hapi.Server('0.0.0.0', config.get('PORT'), {
  cors: true
});

function throwIf (err) {
  if (err) throw err;
}

if (config.get('ssl')) server.pack.register(require('hapi-require-https'), throwIf);

server.pack.register([
  {
    plugin: require('good'),
    options: {
      reporters: [{
        reporter: require('good-console'),
        args: [{log: '*', request: '*', error: '*'}]
      }]
    }
  },
  require('batch-me-if-you-can'),
  require('inject-then'),
  require('./db'),
  require('./campaign'),
  require('./donor'),
  require('./organization'),
  require('./payment'),
  require('./pledge'),
  require('./stripe-connect')
], throwIf);


module.exports = server;
