'use strict';

module.exports = function (server, next) {
  var ref = server.plugins.firebase.ref;
  ref.auth(server.settings.app.config.get('firebase.secret'), next);
};
