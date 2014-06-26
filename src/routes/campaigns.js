'use strict';

var Joi      = require('joi');
var Campaign = require('../models/campaign');

module.exports = function (server) {

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
        params: {
          id: Joi.string().guid()
        }
      }
    }
  });

};
