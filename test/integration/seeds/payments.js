'use strict';

module.exports = [{
  id: require('node-uuid').v4(),
  created_at: new Date(),
  updated_at: new Date(),
  amount: 100,
  provider_name: 'stripe',
  provider_id: 'ch_abc123',
  paid: true,
  pledge_id: require('./pledges')[0].id,
  address_street1: '123 Main St',
  address_street2: 'Apt 1A',
  address_zip: '10000'
}];
