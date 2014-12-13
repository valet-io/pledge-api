'use strict';

var Joi      = require('joi');

module.exports = function (server) {
  var Campaign = server.plugins.campaign.Campaign;
  server.route([
    {
      method: 'GET',
      path: '/',
      handler: function (request, reply) {
        Campaign
          .collection()
          .query(function (qb) {
            var host = request.query.host;
            if (host) qb.where('host', host);
          })
          .fetch()
          .then(reply)
          .catch(reply);
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
          .then(reply)
          .catch(reply);
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
  ]);
};
