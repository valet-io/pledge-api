'use strict';

exports.up = function (knex) {
  return knex.schema.table('campaigns', function (t) {
    t.text('reminder_template');
  });
};

exports.down = function (knex) {
  return knex.schema.table('campaigns', function (t) {
    t.dropColumn('reminder_template');
  });
};
