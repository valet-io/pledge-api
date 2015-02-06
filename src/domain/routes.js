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
        var parameter = !Joi.string().guid().validate(identifier).error ?
          'id' :
          'name';
        return new Domain()
          .where(parameter, identifier)
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
