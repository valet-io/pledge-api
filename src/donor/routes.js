'use strict';

var Donor = require('./donor');
var Joi   = require('joi');
var _     = require('lodash');

module.exports = function (server) {
  var Donor = server.plugins.donor.Donor;
  server.route([
    {
      method: 'POST',
      path: '/',
      handler: function (request, reply) {
        new Donor(request.payload)
          .save(null, {method: 'insert'})
          .call('fetch')
          .then(reply)
          .call('code', 201)
          .catch(reply);
      },
      config: {
        validate: {
          payload: Donor.prototype.schema
        }
      }
    },
    {
      method: 'PUT',
      path: '/{id}',
      handler: function (request, reply) {
        new Donor({id: request.params.id})
          .save(_.omit(request.payload, 'id'), {
            method: 'update',
            require: true
          })
          .call('fetch', {require: true})
          .then(reply)
          .catch(reply);
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
    }
  ]);
};
