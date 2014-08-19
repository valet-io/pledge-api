'use strict';

module.exports = require('nconf')
  .env('__')
  .defaults({
    database: {
      client: 'postgres',
      connection: process.env.DATABASE_URL,
      migrations: {
        directory: __dirname + '/migrations',
        tableName: 'migrations'
      }
    }
  });
