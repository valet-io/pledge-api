'use strict';

module.exports = function (plugin, next) {
  var ref = plugin.plugins.firebase.ref;
  ref.auth(plugin.app.config.get('firebase.secret'), next);
};
