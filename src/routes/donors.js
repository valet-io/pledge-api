'use strict';

var Donor = require('../models/donor');
var Joi   = require('joi');
var _     = require('lodash');

module.exports = function (server) {

  server.route({
    method: 'POST',
    path: '/donors',
    handler: function (request, reply) {
      new Donor(request.payload)
        .save(null, {method: 'insert'})
        .call('fetch')
        .then(reply)
        .call('code', 201)
        .done(null, reply);
    },
    config: {
      validate: {
        payload: Donor.prototype.schema
      }
    }
  });

  server.route({
    method: 'PUT',
    path: '/donors/{id}',
    handler: function (request, reply) {
      new Donor({id: request.params.id})
        .save(_.omit(request.payload, 'id'), {
          method: 'update',
          require: true
        })
        .call('fetch', {require: true})
        .done(reply, reply);
    },
    config: {
      validate: {
        params: {
          id: Joi.string().guid().required()
        },
        payload: _.extend(_.clone(Donor.prototype.schema), {
          id: Joi.valid(Joi.ref('$params.id'))
        })
      }
    }
  });

};
