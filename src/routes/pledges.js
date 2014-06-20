'use strict';

var Joi        = require('joi');
var Pledge     = require('../models/pledge');

module.exports = function (server) {

  server.route({
    method: 'GET',
    path: '/pledges',
    handler: function (request, reply) {
      Pledge
        .collection()
        .query(function (query) {
          for (var constraint in request.query) {
            query.where(constraint, '=', request.query[constraint]);
          }
        })
        .fetch({
          withRelated: ['donor']
        })
        .done(reply);
    }
  });

  server.route({
    method: 'GET',
    path: '/pledges/{id}',
    handler: function (request, reply) {
      new Pledge({id: request.params.id})
        .fetch()
        .done(reply);
    },
    config: {
      validate: {
        path: {
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
        .call('fetch')
        .done(reply);
    }
  });

};
