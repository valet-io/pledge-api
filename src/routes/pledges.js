'use strict';

var Joi        = require('joi');
var _          = require('lodash');
var Pledge     = require('../models/pledge');
var config     = require('../../config');
var stripe     = require('stripe')(config.get('stripe:key'));

module.exports = function (server) {

  server.route({
    method: 'GET',
    path: '/pledges/{id}',
    handler: function (request, reply) {
      new Pledge({id: request.params.id})
        .fetch({require: true})
        .done(reply, reply);
    },
    config: {
      validate: {
        params: {
          id: Joi.string().guid()
        }
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/pledges',
    handler: function (request, reply) {
      new Pledge(request.payload)
        .save()
        .call('fetch', {require: true})
        .then(reply)
        .call('code', 201)
        .done(null, reply);
    },
    config: {
      validate: {
        payload: Pledge.prototype.schema
      }
    }
  });

  server.route({
    method: 'PUT',
    path: '/pledges/{id}',
    handler: function (request, reply) {
      new Pledge({id: request.params.id})
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
        payload: _.extend(_.clone(Pledge.prototype.schema), {
          id: Joi.valid(Joi.ref('$params.id'))
        })
      }
    }
  });

};
