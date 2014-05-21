var nconf = require('nconf');

<<<<<<< HEAD
module.exports = nconf
  .env('_')
=======
nconf
  .env('__')
>>>>>>> db55819... payment endpoint
  .defaults({
    database: {
      host: 'localhost',
      username: 'Ben',
      database: 'valet_io_pledge'
    },
    PORT: 8000
  });
