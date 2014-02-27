'use strict';

var Bookshelf = require('bookshelf');

var Bookshelf = Bookshelf.initialize({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'Ben',
    database: 'valet_io_pledge'
  }
});

Bookshelf
  .plugin('registry');

module.exports = Bookshelf;