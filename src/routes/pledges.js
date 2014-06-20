'use strict';

var _          = require('lodash');
var Pledge     = require('../models/pledge');
var Donor      = require('../models/donor');
var config     = require('../config');
var stripe     = require('stripe')(config.get('stripe:key'));

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
    }
  });

  server.route({
    method: 'POST',
    path: '/pledges',
    handler: function (request, reply) {
      new Donor(request.payload.donor)
        .save()
        .then(function (donor) {
          return new Pledge(_.omit(request.payload, 'donor')).set('donor_id', donor.id).save();
        })      
        .call('fetch')
        .done(reply);
    }
  });

  server.route({
    method: 'PUT',
    path: '/pledges/{id}',
    handler: function (request, reply) {
      new Pledge({id: request.params.id})
        .save(request.payload)
        .call('fetch')
        .done(reply);
    }
  });

  server.route({
    method: 'POST',
    path: '/payments',
    handler: function (request, reply) {
      stripe.charges.create({
        amount: request.payload.amount * 100, 
        currency: 'usd',
        card: request.payload.token,
        metadata: _.omit(request.payload, 'card', 'token', 'amount')
      })
      .then(reply)
      .catch(reply);
    }
  });

};
