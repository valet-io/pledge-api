'use strict';

var Bookshelf = require('bookshelf');

var Bookshelf = Bookshelf.initialize({
  client: 'pg',
  connection: require('../config').get('database')
});

Bookshelf
  .plugin('registry');

module.exports = Bookshelf;