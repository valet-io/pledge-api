'use strict';

var uuid = require('node-uuid');

module.exports = [
  {
    id: uuid.v4(),
    created_at: new Date(),
    updated_at: new Date(),
    amount: 100,
    anonymous: false,
    campaign_id: require('./campaigns')[0].id,
    donor_id: require('./donors')[0].id
  },
  {
    id: uuid.v4(),
    created_at: new Date(),
    updated_at: new Date(),
    amount: 100,
    anonymous: false,
    // unpaid 
    campaign_id: require('./campaigns')[0].id,
    donor_id: require('./donors')[0].id
  },
  {
    id: uuid.v4(),
    created_at: new Date(),
    updated_at: new Date(),
    amount: 100,
    anonymous: false,
    // failed payment 
    campaign_id: require('./campaigns')[0].id,
    donor_id: require('./donors')[0].id
  },
  {
    id: uuid.v4(),
    created_at: new Date(),
    updated_at: new Date(),
    amount: 100,
    anonymous: false,
    // paymentless campaign
    campaign_id: require('./campaigns')[2].id,
    donor_id: require('./donors')[0].id
  }
];
