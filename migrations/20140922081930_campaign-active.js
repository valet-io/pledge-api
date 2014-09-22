'use strict';

exports.up = function (knex) {
  return knex.schema.table('campaigns', function (t) {
    t.boolean('active').defaultTo(true);
  });
};

exports.down = function (knex) {
  return knex.schema.table('campaigns', function (t) {
    t.dropColumn('active');
  });
};
