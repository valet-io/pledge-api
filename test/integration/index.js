'use strict';

var Promise = require('bluebird');
var sinon   = require('sinon-as-promised')(Promise);
var knex    = require('../../src/db').knex;
var events  = require('../../src/events');

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
    sinon.stub(events, 'log').resolves();
    return truncate().then(seed);
  });

  afterEach(function () {
    events.log.restore();
    return truncate();
  });

  require('require-all')(__dirname + '/specs');

});
