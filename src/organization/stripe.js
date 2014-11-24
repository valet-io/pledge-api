'use strict';

var bookshelf = require('../db');
var Model     = bookshelf.Model;

var StripeUser = Model.extend({
  tableName: 'stripe_users',
  idAttribute: 'stripe_user_id'
});

module.exports = bookshelf.model('StripeUser', StripeUser);
