var nconf = require('nconf');

module.exports = nconf
  .env('_')
  .defaults({
    database: {
      client: 'pg'
    }
  });
