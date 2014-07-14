'use strict';

exports.up = function (knex, Promise) {
  return knex.schema.table('payments', function (t) {
    t.boolean('paid');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.table('payments', function (t) {
    t.dropColumn('paid');
  });
};
