'use strict';

exports.up = function (knex, Promise) {
  return knex.schema.raw('ALTER TABLE campaigns ALTER COLUMN metadata SET DEFAULT \'{}\'');
};

exports.down = function (knex, Promise) {
  return knex.schema.raw('ALTER TABLE campaigns ALTER COLUMN metadata DROP DEFAULT');
};
