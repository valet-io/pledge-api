'use strict';

var knex = require('knex')(require('./config').get('database'));

module.exports = require('bookshelf')(knex)
  .plugin('registry')
  .plugin(require('bookshelf-base'));
