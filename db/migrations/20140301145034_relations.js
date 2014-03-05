exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('campaigns', function (t) {
      t.integer('organization_id').unsigned()
        .references('id').inTable('organizations');
    }),
    knex.schema.table('pledges', function (t) {
      t.integer('donor_id').unsigned()
        .references('id').inTable('donors');
      t.integer('campaign_id').unsigned()
        .references('id').inTable('campaigns');
    })
  ]);
};

exports.down = function(knex, Promise) {
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
