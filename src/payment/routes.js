'use strict';

var _       = require('lodash');
var hapi    = require('hapi');
var Joi     = require('joi');
var Payment = require('./payment');

module.exports = [

  {
    method: 'GET',
    path: '/{id}',
    handler: function (request, reply) {
      new Payment({id: request.params.id})
        .fetch({
          require: true,
          withRelated: request.query.expand
        })
        .done(reply, reply);
    },
    config: {
      validate: {
        params: {
          id: Joi.string().guid()
        },
        query: {
          expand: Joi.array().includes(Joi.string())
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/',
    handler: function (request, reply) {
      new Payment(_.omit(request.payload, 'token'))
        .charge(request.payload.token)
        .then(function (payment) {
          return reply(payment.toJSON({shallow: true}));
        })
        .call('code', 201)
        .catch(Payment.CardError, function (err) {
          var error = hapi.error.badRequest(err.message);
          error.output.statusCode = 402;
          error.reformat();
          error.output.payload.error = 'Card Error';
          error.output.payload.code = err.code;
          error.output.payload.id = err.id;
          throw error;
        })
        .catch(reply);
    },
    config: {
      validate: {
        payload: Payment.prototype.schema
      }
    }
  }
];
