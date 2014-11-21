'use strict';

exports.up = function (knex, Promise) {
  return knex.schema.createTable('sms_messages', function (t) {
    t.uuid('id').primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
    t.timestamps();
    t.timestamp('sent_at');
    t.text('from_number').nullable();
    t.text('to_number').notNullable();
    t.text('provider_name').notNullable();
    t.text('provider_id').notNullable();
    t.enum('status', ['queued', 'sent', 'delivered', 'undelivered', 'failed']).defaultTo('queued');
    t.decimal('price');
    t.enum('direction', ['inbound', 'outbound']).notNullable();
    t.text('body').notNullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('sms_messages');
};
