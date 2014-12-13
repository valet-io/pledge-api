'use strict';

var hapi   = require('hapi');
var config = require('./config');

config.validate();

if (config.get('newrelic')) require('newrelic');

var server = new hapi.Server({
  app: {
    config: config
  }
});

server.connection({
  port: config.get('port'),
  routes: {
    cors: true
  }
});

function throwIf (err) {
  /* istanbul ignore next */
  if (err) throw err;
}

/* istanbul ignore next */
if (config.get('ssl')) server.register(require('hapi-require-https'), throwIf);

if (config.get('sentry.dsn')) server.register({
  register: require('hapi-raven'),
  options: {
    dsn: config.get('sentry.dsn')
  }
}, throwIf);

server.register([
  {
    register: require('good'),
    options: {
      reporters: [{
        reporter: require('good-console'),
        args: [{log: '*', request: '*', error: '*'}]
      }]
    }
  },
  require('batch-me-if-you-can'),
  require('inject-then'),
  require('./db')
], throwIf);

server.register(require('./campaign'), {
  routes: {
    prefix: '/campaigns'
  }
}, throwIf);
server.register(require('./donor'), {
  routes: {
    prefix: '/donors'
  }
}, throwIf);
server.register(require('./organization'), {
  routes: {
    prefix: '/organizations'
  }
}, throwIf);
server.register(require('./stripe'), {
  routes: {
    vhost: ['stripe.valet.io', 'stripe-staging.valet.io', 'localhost']
  }
}, throwIf);
server.register(require('./payment'), {
  routes: {
    prefix: '/payments'
  }
}, throwIf);
server.register(require('./pledge'), {
  routes: {
    prefix: '/pledges'
  }
}, throwIf);
server.register(require('./firebase'), throwIf);


module.exports = server;
