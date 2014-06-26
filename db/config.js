module.exports = {
  database: require('../src/config').get('database')
  directory: './db/migrations',
  tableName: 'migrations' 
};
