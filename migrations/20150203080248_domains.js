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
    })
    .then(function () {
      return knex.from('campaigns').select('id', 'host').whereNotNull('host');
    })
    .map(function (campaign) {
      return knex
        .into('domains')
        .insert({
          name: campaign.host,
          updated_at: new Date()
        })
        .returning('id')
        .then()
        .get(0)
        .then(function (domainId) {
          return knex('campaigns')
            .update('domain_id', domainId)
            .where('id', campaign.id);
        });
    })
    .then(function () {
      return knex.schema.table('campaigns', function (t) {
        t.dropColumn('host');
      });
    });

};

exports.down = function (knex, Promise) {
  return knex.schema.table('campaigns', function (t) {
    t.text('host');
  })
  .then(function () {
    return knex.from('domains').select('id', 'name');
  })
  .map(function (domain) {
    return knex('campaigns').update('host', domain.name).where('domain_id', domain.id);
  })
  .then(function () {
    return knex.schema
      .table('campaigns', function (t) {
        t.dropColumn('domain_id');
      })
      .dropTable('domains')
      .dropTable('domain_registrations');
  });  
};
