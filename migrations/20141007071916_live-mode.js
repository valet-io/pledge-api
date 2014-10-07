'use strict';

var tables = ['pledges', 'donors', 'payments'];

exports.up = function (knex, Promise) {
  return Promise.map(tables, function (table) {
    return knex.schema.table(table, function (t) {
      t.boolean('live').defaultTo(true);
    });
  });
};

exports.down = function (knex, Promise) {
  return Promise.map(tables, function (table) {
    return knex.schema.table(table, function (t) {
      t.dropColumn('live');
    });
  });
};
