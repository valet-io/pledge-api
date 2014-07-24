'use strict';

var Donor = require('../models/donor');

module.exports = function (server) {

  server.route({
    method: 'POST',
    path: '/donors',
    handler: function (request, reply) {
      new Donor(request.payload)
        .save()
        .call('fetch', {require: true})
        .then(reply)
        .call('code', 201)
        .done(null, reply);
    },
    config: {
      validate: {
        payload: Donor.prototype.schema
      }
    }
  });

};
