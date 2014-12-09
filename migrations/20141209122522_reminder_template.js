'use strict';

exports.up = function (knex) {
  knex.schema.table('campaigns', function (t) {
    t.text('reminder_template');
  });
};

exports.down = function (knex) {
  knex.schema.table('campaigns', function (t) {
    t.dropColumn('reminder_template');
  });
};
