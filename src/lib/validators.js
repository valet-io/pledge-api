'use strict';

var Hapi = require('hapi');

exports.id = function () {
  return Hapi.types.number().integer().min(0);
};