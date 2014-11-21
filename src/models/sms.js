'use strict';

var Joi   = require('joi');
var Model = require('../db').Model;

module.exports = Model.extend({
  tableName: 'sms_messages',
  schema: {
    id: Joi.string().guid(),
    created_at: Joi.date(),
    updated_at: Joi.date(),
    sent_at: Joi.date().allow(null),
    from_number: Joi.string().allow(null),
    to_number: Joi.string().required(),
    provider_name: Joi.string().required().valid('twilio'),
    provider_id: Joi.string().required(),
    status: Joi.string().valid('queued', 'sent', 'delivered', 'undelivered', 'failed').default('queued'),
    price: Joi.number(),
    direction: Joi.string().valid('inbound', 'outbound').required(),
    body: Joi.string()
  },
});
