'use strict';

var SMS = require('../models/sms');
var joi = require('joi');

module.exports = function (server) {
  server.route({
    method: 'POST',
    path: '/messages',
    handler: function (request, reply) {
      new SMS(request.payload)
        .save(null, {method: 'insert'})
        .call('fetch')
        .then(reply)
        .call('code', 201)
        .catch(reply);
    },
    config: {
      validate: {
        payload: {
          id: joi.string().guid(),
          created_at: joi.date(),
          updated_at: joi.date(),
          sent_at: joi.date().when('direction', {
            is: 'inbound',
            then: joi.required(),
            otherwise: joi.forbidden()
          }),
          from_number: joi.string().when('direction', {
            is: 'inbound',
            then: joi.required()
          }),
          to_number: joi.string().required(),
          provider_name: joi.string().valid('twilio').when('direction', {
            is: 'inbound',
            then: joi.required(),
            otherwise: joi.forbidden()
          }),
          provider_id: joi.string().when('direction', {
            is: 'inbound',
            then: joi.required(),
            otherwise: joi.forbidden()
          }),
          status: joi.string().when('direction', {
            is: 'inbound',
            then: joi.valid('received').default('received'),
            otherwise: joi.forbidden()
          }),
          price: joi.number().when('direction', {
            is: 'inbound',
            then: joi.required(),
            otherwise: joi.forbidden()
          }),
          direction: joi.valid('inbound', 'outbound').default('outbound'),
          body: joi.string().required()
        }
      }
    }
  });
};
