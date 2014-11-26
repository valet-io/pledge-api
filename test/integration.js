'use strict';

require('./setup');
var server = require('../');

var Promise = require('bluebird');
var knex    = server.plugins.db.knex;

var tables = [
  'organizations',
  'campaigns',
  'donors',
  'pledges',
  'payments',
  'stripe_users'
];

function truncate () {
  return Promise.each(tables, function (table) {
    return knex.raw('truncate table ' + table + ' cascade');
  });
}

function seed () {
  return Promise.each(tables, function (table) {
    return knex(table).insert(require('./integration/seeds/' + table));
  });
}

describe('Integration Tests', function () {

  beforeEach(function () {
    return truncate().then(seed);
  });

  afterEach(function () {
    return truncate();
  });

  var suites = require('require-all')(__dirname + '/integration/specs');
  Object.keys(suites)
    .forEach(function (suite) {
      suites[suite](server);
    });

});
