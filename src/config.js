'use strict';

module.exports = require('nconf')
  .env('_')
  .defaults({
    database: {
      client: 'postgres',
      connection: {
        adapter: 'postgresql'
      },
      migrations: {
        directory: __dirname + '/../migrations',
        tableName: 'migrations'
      }
    }
  });
