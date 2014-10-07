'use strict';

var Joi        = require('joi');
var _          = require('lodash');
var Pledge     = require('../models/pledge');
var config     = require('../../config');

module.exports = function (server) {

  server.route({
    method: 'GET',
    path: '/pledges/{id}',
    handler: function (request, reply) {
      new Pledge({id: request.params.id})
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
      },
      cache: {
        expiresIn: 60 * 60 * 1000
      }
    }
  });

  server.route({
    method: 'get',
    path: '/pledges',
    handler: function (request, reply) {
      var pledge = new Pledge();
      if (typeof request.query.paid !== 'undefined') {
        pledge.paid(request.query.paid);
      }
      if (typeof request.query.cancelled !== 'undefined') {
        pledge.where({cancelled: request.query.cancelled});
      }
      pledge.where({live: request.query.live});
      return pledge.fetchAll({
        withRelated: request.query.expand
      })
      .done(reply, reply);
    },
    config: {
      validate: {
        query: {
          paid: Joi.boolean(),
          cancelled: Joi.boolean(),
          live: Joi.boolean().default(true),
          expand: Joi.array().includes(Joi.string())
        }
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/pledges',
    handler: function (request, reply) {
      new Pledge(request.payload)
        .save(null, {method: 'insert'})
        .call('fetch')
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
