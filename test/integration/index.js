'use strict';

var Promise   = require('bluebird');
var knex      = require('../../src/db').knex;
var internals = {};

var tables = [
  'organizations',
  'campaigns',
  'donors',
  'pledges',
  'payments'
];

internals.truncate = function () {
  return Promise.each(tables, function (table) {
    return knex.raw('truncate table ' + table + ' cascade');
  });
};

internals.seed = function () {
  return Promise.each(tables, function (table) {
    return knex(table).insert(require('./seeds/' + table));
  });
};

describe('Integration Tests', function () {

  before(function () {
    return internals.truncate().then(internals.seed);
  });

  after(function () {
    return internals.truncate();
  });

  require('require-all')(__dirname + '/specs');

});
