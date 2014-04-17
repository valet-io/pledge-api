var Hapi  = require('hapi');
var nconf = require('./config')

var server = new Hapi.Server('0.0.0.0', +nconf.get('port'), {cors: true});

require('./lib/firebase')(require('firebase'));
require('./routes/campaigns')(server);
require('./routes/pledges')(server);

server.start(function () {
  console.log('Server started at: ' + server.info.uri);
});