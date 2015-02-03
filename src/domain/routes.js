'use strict';

var Joi = require('joi');

module.exports = function (server) {
  var Domain = server.plugins.domain.Domain;
  server.route([
    {
      method: 'GET',
      path: '/{id}',
      handler: function (request, reply) {
        var identifier = request.params.id;
        var domain;
        // identifier in path is uuid
        if (!Joi.string().guid().validate(identifier).error) {
          domain = new Domain({
            id: identifier
          });
        }
        // otherwise identifier is the hostname
        else {
          domain = new Domain({
            name: identifier
          })
          .where('active', true);
        }
        return domain
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
            id: Joi.alternatives().try(
              Joi.string().guid(),
              Joi.string().hostname()
            )
          },
          query: {
            expand: Joi.array().includes(Joi.string())
          }
        }
      }
    }
  ]);
};
