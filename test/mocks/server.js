'use strict';

var Hapi = require('hapi');
var injectThen = require('../../src/lib/inject-then');

module.exports = function () {
  return injectThen(new Hapi.Server());
}