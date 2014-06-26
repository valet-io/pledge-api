'use strict';

var knex      = require('knex');
var Bookshelf = require('bookshelf');

var bookshelf = Bookshelf(knex({
  client: 'pg',
  connection: require('./config').get('database')
}));

bookshelf
  .plugin('registry')
  .plugin(require('bookshelf-base'));

module.exports = bookshelf;
