'use strict';

var hapi   = require('hapi');
var fs     = require('fs');
var config = require('./config');

var server = new hapi.Server('0.0.0.0', config.get('PORT'), {
  cors: true,
  tls: config.get('ssl') && {
    key: fs.readFileSync(config.get('ssl:key')),
    cert: fs.readFileSync(config.get('ssl:cert'))
  }
});

server.pack.require('good', {
  subscribers: {
    console: ['ops', 'request', 'log', 'error'],
    'udp://logs.papertrailapp.com:44076': ['ops', 'request', 'log', 'error']
  }
}, function (err) {
  if (err) throw err;
});

require('./lib/firebase')(require('firebase'));
require('./routes/campaigns')(server);
require('./routes/pledges')(server);

server.start(function () {
  console.log('Server started at: ' + server.info.uri);
});
