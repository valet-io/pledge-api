'use strict';

var config = require('../config');

module.exports = require('stripe')(config.get('stripe.key'));
