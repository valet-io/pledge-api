'use strict';

exports.up = function(knex, Promise) {
  return knex.raw('CREATE EXTENSION "uuid-ossp"')
    .then(function () {
      return Promise.all([
        knex.schema.createTable('organizations', function (t) {
          t.uuid('id').primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
          t.timestamps();
          t.string('name');
        }),
        knex.schema.createTable('campaigns', function (t) {
          t.uuid('id').primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
          t.timestamps();
          t.string('name');
          t.string('host').unique();
          t.json('metadata');
        }),
        knex.schema.createTable('pledges', function (t) {
          t.uuid('id').primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
          t.timestamps();
          t.integer('amount');
          t.boolean('anonymous');
          t.dateTime('started_at');
          t.dateTime('submitted_at');
        }),
        knex.schema.createTable('donors', function (t) {
          t.uuid('id').primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
          t.timestamps();
          t.string('name');
          t.string('phone');
          t.string('email');
        })
      ]);
    });
};

exports.down = function(knex, Promise) {
  return Promise.map([
    'organizations',
    'campaigns',
    'pledges',
    'donors'
  ], knex.schema.dropTable);
};
