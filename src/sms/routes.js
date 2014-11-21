'use strict';

var Sms     = require('./model');
var schemas = require('./schemas');

module.exports = {
  method: 'POST',
  path: '/',
  handler: function (request, reply) {
    new Sms(request.payload)
      .save(null, {method: 'insert'})
      .call('fetch')
      .then(reply)
      .call('code', 201)
      .catch(reply);
  },
  config: {
    validate: {
      payload: schemas.create
    }
  }
};
