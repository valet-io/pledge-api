'use strict';

exports.register = function (plugin, options, next) {
  require('./organization');
  require('./stripe');
  next();
};

exports.register.attributes = {
  name: 'organization'
};
