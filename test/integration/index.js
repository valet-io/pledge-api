'use strict';

var Promise   = require('bluebird');
var knex      = require('../../src/db').knex;

var tables = [
  'organizations',
  'campaigns',
  'donors',
  'pledges',
  'payments'
];

function truncate () {
  return Promise.each(tables, function (table) {
    return knex.raw('truncate table ' + table + ' cascade');
  });
};

function seed () {
  return Promise.each(tables, function (table) {
    return knex(table).insert(require('./seeds/' + table));
  });
};

describe('Integration Tests', function () {

  beforeEach(function () {
    return truncate().then(seed);
  });

  afterEach(function () {
    return truncate();
  });

  require('require-all')(__dirname + '/specs');

});
