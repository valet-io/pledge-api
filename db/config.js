module.exports = {
  database: {
    client: 'pg',
    connection: require('../src/config').get('database')
  },
  directory: './db/migrations',
  tableName: 'migrations' 
};