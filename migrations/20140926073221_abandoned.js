'use strict';

exports.up = function (knex) {
  return knex.schema.table('pledges', function (t) {
    t.boolean('cancelled').defaultTo(false);
    t.enum('cancelled_reason', ['fake','abandoned', 'donor_request', 'bad_contact_info', 'duplicate']);
  });
};

exports.down = function (knex) {
  return knex.schema.table('pledges', function (t) {
    t.dropColumns('cancelled', 'cancelled_reason');
  });
};
