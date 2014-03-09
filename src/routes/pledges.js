'use strict';
var _          = require('lodash');
var validators = require('../lib/validators');
var Pledge     = require('../models/pledge');
var Donor      = require('../models/donor');

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
        .fetch()
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
          id: validators.id().required()
        }
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/pledges',
    handler: function (request, reply) {
      new Donor(request.payload.donor)
        .save()
        .then(function (donor) {
          return new Pledge(_.omit(request.payload, 'donor'))
            .set('donor_id', donor.id)
            .save();
        })
        .done(reply);
    }
  });

}