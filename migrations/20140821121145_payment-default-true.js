'use strict';

exports.up = function (knex, Promise) {
  return knex.raw('ALTER TABLE ONLY campaigns ALTER COLUMN payments SET DEFAULT true');
};

exports.down = function (knex, Promise) {
  return knex.raw('ALTER TABLE ONLY campaigns ALTER COLUMN payments SET DEFAULT null');
};
