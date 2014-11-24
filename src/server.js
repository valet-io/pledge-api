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

if (config.get('ssl')) {
  server.ext('onRequest', function (request, reply) {
    if (request.headers['x-forwarded-proto'] !== 'https') {
      return reply('Forwarding to https')
        .redirect('https://' + request.headers.host + request.path);
    }
    reply();
  });
}

function throwIf (err) {
  if (err) throw err;
}

server.pack.register({
  plugin: require('good'),
  options: {
    subscribers: {
      console: ['request', 'log', 'error']
    }
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
