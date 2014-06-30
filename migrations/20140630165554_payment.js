'use strict';

exports.up = function (knex, Promise) {
  return knex.schema.table('pledges', function (t) {
    t.text('payment_id');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.table('pledges', function (t) {
    t.dropColumn('payment_id');
  });
};
