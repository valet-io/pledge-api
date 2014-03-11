module.exports = {
  database: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  },
  directory: './db/migrations',
  tableName: 'migrations' 
};