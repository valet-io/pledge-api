'use strict';

var Sms     = require('./model');
var schemas = require('./schemas');

module.exports = {
  method: 'POST',
  path: '/',
  handler: function (request, reply) {
    var promise;
    if (Array.isArray(request.payload)) {
      promise = Sms.batch(request.payload);
    }
    else {
      promise = new Sms(request.payload)
        .save(null, {method: 'insert'})
        .call('fetch');
    }
    return promise.then(reply)
      .call('code', 201)
      .catch(reply);
  },
  config: {
    validate: {
      payload: schemas.create
    }
  }
};
