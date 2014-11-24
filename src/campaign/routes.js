'use strict';

var Joi      = require('joi');
var Campaign = require('./campaign');

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      Campaign
        .collection()
        .query(function (qb) {
          var query = request.query;
          if (query.host) qb.where('host', request.query.host);
        })
        .fetch()
        .done(reply, reply);
    },
    config: {
      validate: {
        query: {
          host: Joi.string().hostname()
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/{id}',
    handler: function (request, reply) {
      Campaign
        .where({id: request.params.id})
        .fetch({require: true})
        .done(reply, reply);
    },
    config: {
      validate: {
        params: {
          id: Joi.string().guid()
        }
      },
      cache: {
        expiresIn: 60 * 60 * 1000
      }
    }
  }
];
