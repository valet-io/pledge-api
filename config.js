'use strict';

module.exports = require('nconf')
  .use('memory')
  .env('__')
  .defaults({
    database: {
      client: 'pg',
      connection: process.env.DATABASE_URL || {
        database: 'valet_io_pledge',
        username: 'postgres'
      },
      migrations: {
        directory: __dirname + '/migrations',
        tableName: 'migrations'
      }
    }
  });
