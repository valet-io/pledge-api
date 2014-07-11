'use strict';

var hapi   = require('hapi');
var fs     = require('fs');
var config = require('../config');

var server = new hapi.Server('0.0.0.0', config.get('PORT'), {
  cors: true,
  tls: config.get('ssl') && {
    key: fs.readFileSync(config.get('ssl:key')),
    cert: fs.readFileSync(config.get('ssl:cert'))
  }
});

var env = config.get('NODE:ENV');

if (env === 'production' || env === 'staging') {
  server.pack.register({
    plugin: require('good'),
    options: {
      subscribers: {
        console: ['ops', 'request', 'log', 'error'],
        'udp://logs.papertrailapp.com:44076': ['ops', 'request', 'log', 'error']
      }
    }
  }, function (err) {
    if (err) throw err;
  });
}

require('./routes/campaigns')(server);
require('./routes/pledges')(server);

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
