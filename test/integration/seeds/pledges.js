'use strict';

module.exports = [{
  id: require('node-uuid').v4(),
  created_at: new Date(),
  updated_at: new Date(),
  amount: 100,
  anonymous: false,
  campaign_id: require('./campaigns')[0].id,
  donor_id: require('./donors')[0].id
}];
