'use strict';

var Hapi       = require('hapi');
var validators = require('../lib/validators');
var Campaign   = require('../models/campaign');

module.exports = function (server) {

  server.route({
    method: 'GET',
    path: '/campaigns',
    handler: function (request, reply) {
      Campaign
        .collection()
        .query(function (query) {
          for (var constraint in request.query) {
            query.where(constraint, '=', request.query[constraint]);
          }
        })
        .fetch()
        .done(reply);
    }
  });

  server.route({
    method: 'GET',
    path: '/campaigns/{id}',
    handler: function (request, reply) {
      new Campaign({id: request.params.id})
        .fetch()
        .done(reply);
    },
    config: {
      validate: {
        path: {
          id: validators.id().required()
        }
      }
    }
  });

};