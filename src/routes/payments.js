'use strict';

var _       = require('lodash');
var hapi    = require('hapi');
var Joi     = require('joi');
var Payment = require('../models/payment');

module.exports = function (server) {

  server.route({
    method: 'POST',
    path: '/payments',
    handler: function (request, reply) {
      new Payment(_.omit(request.payload, 'token'))
        .charge(request.payload.token)
        .then(reply)
        .call('code', 201)
        .catch(function (err) {
          return err.type === 'StripeCardError'
        }, function (err) {
          var error = hapi.error.badRequest(err.message);
          error.output.statusCode = 402;
          error.reformat();
          error.output.payload.error = 'Card Error';
          throw error;
        })
        .done(null, reply);
    },
    config: {
      validate: {
        payload: _.extend(_.clone(Payment.prototype.schema), {
          token: Joi.string().required()
        })
      }
    }
  });

};
