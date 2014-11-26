'use strict';
var server = require('./server');

server.start(function () {
  console.log('Server started at: ' + server.info.uri);
});
