exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('organizations', function (t) {
      t.increments('id');
      t.timestamps();
      t.string('name');
    }),
    knex.schema.createTable('campaigns', function (t) {
      t.increments('id');
      t.timestamps();
      t.string('name');
      t.json('metadata');
    }),
    knex.schema.createTable('pledges', function (t) {
      t.increments('id');
      t.timestamps();
      t.integer('amount');
      t.boolean('anonymous');
      t.integer('payment_id').unsigned();
      t.dateTime('started_at');
      t.dateTime('submitted_at');
    }),
    knex.schema.createTable('donors', function (t) {
      t.increments('id');
      t.timestamps();
      t.string('name');
      t.string('phone');
      t.string('email');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.map([
    'organizations',
    'campaigns',
    'pledges',
    'donors'
  ], knex.schema.dropTable);
};
