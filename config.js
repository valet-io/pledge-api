'use strict';

module.exports = require('nconf')
  .use('memory')
  .env('__')
  .defaults({
    database: {
      client: 'pg',
      connection: process.env.DATABASE_URL,
      migrations: {
        directory: __dirname + '/migrations',
        tableName: 'migrations'
      }
    }
  });
