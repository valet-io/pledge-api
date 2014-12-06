'use strict';

exports.up = function (knex, Promise) {
  return knex.schema.table('payments', function (t) {
    t.text('address_street1');
    t.text('address_street2');
    t.text('address_zip');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.table('payments', function (t) {
    t.dropColumns('address_street1', 'address_street2', 'address_zip');
  });
};
