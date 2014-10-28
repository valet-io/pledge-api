'use strict';

var Promise = require('bluebird');
var ironmq  = require('iron_mq');
Promise.promisifyAll(ironmq.Client.prototype);
var imq     = new ironmq.Client(require('../config').get('iron'));

exports.log = function (resource, event, id) {
  return imq.queue('events::' + resource).postAsync(JSON.stringify({
    resource: resource,
    event: event,
    id: id,
    created_at: new Date()
  }));
};
