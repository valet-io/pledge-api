'use strict';

var config = require('../../../config');

module.exports = [{
  organization_id: require('./organizations')[1].id,
  stripe_access_token: config.get('stripe:key')
}];
