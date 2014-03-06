'use strict';

var Promise = require('bluebird');

module.exports = function (server) {
  server.injectThen = function (options, callback) {
    return new Promise(function (resolve, reject) {
      server.inject(options, resolve);
    });
  };
  return server;
};