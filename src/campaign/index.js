'use strict';

exports.register = function (plugin, options, next) {
  plugin.route(require('./routes'));
  next();
};

exports.register.attributes = {
  name: 'campaign'
};
