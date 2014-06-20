var nconf = require('nconf');

module.exports = nconf
  .env()
  .defaults({
    database: {
      host: 'localhost',
      username: 'Ben',
      database: 'valet_io_pledge'
    },
    PORT: 8000
  });
