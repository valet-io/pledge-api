'use strict';

var uuid = require('node-uuid');

var campaignId = uuid.v4();

module.exports = {
  id: uuid.v4(),
  attributes: {
    amount: 10
  },
  get: function (key) {
    return this.attributes[key];
  },
  load: function () {
    return this;
  },
  then: function (callback) {
    callback.call(null, this);
  },
  campaign: function () {
    return {
      id: campaignId
    };
  },
  related: function (model) {
    return this[model]();
  },
  toFirebase: function () {
    return {
      donor: {
        name: 'Ben Drucker'
      },
      anonymous: false,
      amount: 1
    };
  }
};
