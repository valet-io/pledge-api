'use strict';

exports.up = function (knex, Promise) {
  return knex.schema
    .createTable('domain_registrations', function (t) {
      t.uuid('id').primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
      t.timestamps();
      t.dateTime('expires_at').notNullable();
      t.text('provider_name').notNullable();
      t.text('provider_id').notNullable();
      t.decimal('price');
    })
    .createTable('domains', function (t) {
      t.uuid('id').primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
      t.uuid('registration_id').references('id').inTable('domain_registrations');
      t.text('name').notNullable();
      t.timestamps();
      t.boolean('active').defaultTo(true).notNullable();
    })
    .table('campaigns', function (t) {
      t.uuid('domain_id').references('id').inTable('domains');
    });
};

exports.down = function (knex, Promise) {
  return knex.schema
    .table('campaigns', function (t) {
      t.dropColumn('domain_id');
    })
    .dropTable('domains')
    .dropTable('domain_registrations');
};
