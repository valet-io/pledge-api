'use strict';

var Firebase = require('firebase');

var FireMock = function (ref) {
  Firebase.call(this, ref.replace('valet-io-events', 'valet-io-test'));
};

FireMock.prototype = Firebase.prototype;

module.exports = FireMock;