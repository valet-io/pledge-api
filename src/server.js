'use strict';

var hapi   = require('hapi');
var config = require('./config');

config.validate();

var server = new hapi.Server('0.0.0.0', config.get('port'), {
  cors: true
});

function throwIf (err) {
  /* istanbul ignore next */
  if (err) throw err;
}

/* istanbul ignore next */
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
