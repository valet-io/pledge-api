require('mockery').registerAllowable('sinon');
var sinon = require('sinon');

var Firebase = function () {};

module.exports = sinon.spy(Firebase);