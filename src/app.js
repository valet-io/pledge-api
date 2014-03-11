var Hapi = require('hapi');

var server = new Hapi.Server('localhost', process.env.PORT || 8000, {cors: true});

require('./routes/campaigns')(server);
require('./routes/pledges')(server);

server.start(function () {
  console.log('Server started at: ' + server.info.uri);
});