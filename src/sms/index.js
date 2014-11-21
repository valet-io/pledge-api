'use strict';

exports.register = function (plugin, options, next) {
  plugin.route(require('./routes'));
  plugin.expose('model', require('./model'));
  next();
};

exports.register.attributes = {
  name: 'sms'
};
