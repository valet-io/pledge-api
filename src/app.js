'use strict';

var hapi   = require('hapi');
var fs     = require('fs');
var config = require('./config');

var server = new hapi.Server('0.0.0.0', config.get('port'), {
  cors: true,
  tls: config.get('ssl') && {
    key: fs.readFileSync(config.get('ssl:key')),
    cert: fs.readFileSync(config.get('ssl:cert'))
  }
});

require('./lib/firebase')(require('firebase'));
require('./routes/campaigns')(server);
require('./routes/pledges')(server);

server.start(function () {
  console.log('Server started at: ' + server.info.uri);
});
