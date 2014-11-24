'use strict';

exports.up = function (knex, Promise) {
  return knex.schema.createTable('stripe_users', function (t) {
    t.uuid('organization_id').primary().references('id').inTable('organizations');
    t.timestamps();
    t.text('stripe_user_id');
    t.text('stripe_access_token');
    t.text('stripe_test_access_token');
    t.text('stripe_refresh_token');
    t.text('stripe_publishable_key');
    t.text('stripe_test_publishable_key');
  });  
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('stripe_users');
};
