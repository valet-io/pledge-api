'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('campaigns', function (t) {
    t.boolean('payments');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('campaigns', function (t) {
    t.dropColumn('payments');
  });
};
