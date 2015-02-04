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
          .fetchAll()
          .then(reply)
          .catch(reply);
      }
    },
    {
      method: 'GET',
      path: '/{id}',
      handler: function (request, reply) {
        Campaign
          .where({id: request.params.id})
          .fetch({
            require: true,
            withRelated: request.query.expand
          })
          .then(reply)
          .catch(reply);
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
    }
  ]);
};
