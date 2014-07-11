'use strict';

var Joi      = require('joi');
var Campaign = require('../models/campaign');

module.exports = function (server) {

  server.route({
    method: 'GET',
    path: '/campaigns',
    handler: function (request, reply) {
      Campaign
        .collection()
        .query(function (qb) {
          var query = request.query;
          query.host && qb.where('host', request.query.host);
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
  });

  server.route({
    method: 'GET',
    path: '/campaigns/{id}',
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
      }
    }
  });

};
