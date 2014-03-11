'use strict';

var Bookshelf = require('bookshelf');

var Bookshelf = Bookshelf.initialize({
  client: 'pg',
  connection: process.env.DATABASE_URL
});

Bookshelf
  .plugin('registry');

module.exports = Bookshelf;