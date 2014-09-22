'use strict';

exports.up = function (knex) {
  return knex.schema.hasColumn('pledges', 'payment_id')
    .then(function (has) {
      return has && knex.schema.table('pledges', function (t) {
        t.dropColumn('payment_id');
      });
    });
};

exports.down = function () {};
