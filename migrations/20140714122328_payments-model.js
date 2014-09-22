'use strict';

exports.up = function (knex, Promise) {
  return knex.schema.createTable('payments', function (t) {
    t.uuid('id').primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('pledge_id').references('id').inTable('pledges');
    t.integer('amount');
    t.text('provider_name');
    t.text('provider_id');
    t.timestamps();
  })
  .then(function () {
    return knex.table('pledges', function (t) {
      t.dropColumn('payment_id');
    });
  });
};

exports.down = function (knex, Promise) {
  return knex.table('pledges', function (t) {
    t.text('payment_id');
  })
  .then(function () {
    return knex.dropTable('payments');
  });
};
