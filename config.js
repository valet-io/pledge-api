'use strict';

module.exports = require('nconf')
  .env('__')
  .defaults({
    database: {
      client: 'postgres',
      connection: {
        adapter: 'postgresql'
      },
      migrations: {
        directory: './migrations',
        tableName: 'migrations'
      }
    }
  });
