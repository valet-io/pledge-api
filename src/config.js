var nconf = require('nconf');

module.exports = nconf
  .env('_')
  .defaults({
    firebase: 'https://valet-io-events.firebaseio.com',
    database: {
      host: 'localhost',
      username: 'Ben',
      database: 'valet_io_pledge'
    },
    PORT: 8000
  });
