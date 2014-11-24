'use strict';

exports.register = function (plugin, options, next) {
  require('./organization');
  next();
};

exports.register.attributes = {
  name: 'organization'
};
