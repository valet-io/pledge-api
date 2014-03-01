module.exports = {
  database: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'Ben',
      database: 'valet_io_pledge'
    }
  },
  directory: './db/migrations',
  tableName: 'migrations' 
};