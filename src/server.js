'use strict';

var hapi   = require('hapi');
var _      = require('lodash');
var config = require('../config');

var server = new hapi.Server('0.0.0.0', config.get('PORT'), {
  cors: true,
  cache: _.extend(config.get('redis'), {
    engine: require('catbox-redis')
  })
});

function throwIf (err) {
  if (err) throw err;
}

server.pack.register(require('hapi-require-https'), throwIf);

server.pack.register({
  plugin: require('good'),
  options: {
    reporters: [{
      reporter: require('good-console'),
      args: [{log: '*', request: '*', error: '*'}]
    }]
  }
}, function (err) {
  if (err) throw err;
});

server.pack.register([require('batch-me-if-you-can'), require('inject-then')], function (err) {
  if (err) throw err;
});

server.pack.register(require('./campaign'), {
  route: {
    prefix: '/campaigns'
  }
}, throwIf);
server.pack.register(require('./donor'), {
  route: {
    prefix: '/donors'
  }
}, throwIf);
server.pack.register(require('./organization'), {
  route: {
    prefix: '/organizations'
  }
}, throwIf);
server.pack.register(require('./payment'), {
  route: {
    prefix: '/payments'
  }
}, throwIf);
server.pack.register(require('./pledge'), {
  route: {
    prefix: '/pledges'
  }
}, throwIf);
server.pack.register(require('./stripe-connect'), {
  route: {
    vhost: ['stripe.valet.io', 'stripe-staging.valet.io', 'localhost']
  }
}, throwIf)

server.ext('onPreResponse', function (request, reply) {
  var response = request.response;
  if (response instanceof require('./db').Model.NotFoundError) {
    return reply(hapi.error.notFound());
  }
  else if (response.isBoom && response.message.indexOf('No rows were affected in the update') !== -1) {
    return reply(hapi.error.notFound());
  }
  reply();
});


module.exports = server;
