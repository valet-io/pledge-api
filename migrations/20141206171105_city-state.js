'use strict';

exports.up = function (knex, Promise) {
  return knex.schema.table('payments', function (t) {
    t.text('address_city');
    t.text('address_state');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('payments', function (t) {
    t.dropColumns('address_city', 'address_state');
  });
};
