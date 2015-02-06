'use strict';

var uuid    = require('node-uuid');
var domains = require('./domains');

module.exports = [
  {
    id: uuid.v4(),
    created_at: new Date(),
    updated_at: new Date(),
    name: 'Simba Gala',
    domain_id: domains[0].id,
    payments: true,
    active: true,
    metadata: JSON.stringify({
      logo: 'url'
    }),
    organization_id: require('./organizations')[0].id
  },
  {
    id: uuid.v4(),
    created_at: new Date(),
    updated_at: new Date(),
    name: 'Inactive Gala',
    active: false,
    payments: true,
    organization_id: require('./organizations')[0].id
  },
  {
    id: uuid.v4(),
    created_at: new Date(),
    updated_at: new Date(),
    name: 'Paymentless Gala',
    active: true,
    payments: false,
    organization_id: require('./organizations')[0].id
  },
  {
    id: uuid.v4(),
    created_at: new Date(),
    updated_at: new Date(),
    name: 'Connect Gala',
    active: true,
    organization_id: require('./organizations')[1].id
  }
];
