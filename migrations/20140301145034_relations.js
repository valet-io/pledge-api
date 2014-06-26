'use strict';

exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('campaigns', function (t) {
      t.uuid('organization_id').references('id').inTable('organizations');
    }),
    knex.schema.table('pledges', function (t) {
      t.uuid('donor_id').references('id').inTable('donors');
      t.uuid('campaign_id').references('id').inTable('campaigns');
    })
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('campaigns', function (t) {
      t.dropColumn('organization_id');
    }),
    knex.schema.table('pledges', function (t) {
      t.dropColumn('donor_id');
      t.dropColumn('campaign_id');
    })
  ]);
};
