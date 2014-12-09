'use strict';

var hapi   = require('hapi');
var config = require('./config');

config.validate();

if (config.get('newrelic')) require('newrelic');

var pack = new hapi.Pack({
  app: {
    config: config
  }
});

var server = pack.server('0.0.0.0', config.get('port'), {
  cors: true
});

function throwIf (err) {
  /* istanbul ignore next */
  if (err) throw err;
}

/* istanbul ignore next */
if (config.get('ssl')) pack.register(require('hapi-require-https'), throwIf);

if (config.get('sentry.dsn')) pack.register({
  plugin: require('hapi-raven'),
  options: {
    dsn: config.get('sentry.dsn')
  }
}, throwIf);

pack.register([
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
  require('./stripe'),
  require('./campaign'),
  require('./donor'),
  require('./organization'),
  require('./payment'),
  require('./pledge'),
  require('./firebase')
], throwIf);


module.exports = server;
