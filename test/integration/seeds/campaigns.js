'use strict';

module.exports = [{
  id: require('node-uuid').v4(),
  created_at: new Date(),
  updated_at: new Date(),
  name: 'Simba Gala',
  host: 'www.ssgala.org',
  payments: true,
  metadata: JSON.stringify({
    logo: 'url'
  }),
  organization_id: require('./organizations')[0].id
}];
