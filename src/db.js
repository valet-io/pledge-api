'use strict';

exports.knex = require('knex')(require('../config').get('database'));

exports.bookshelf = require('bookshelf')(exports.knex)
  .plugin('registry')
  .plugin(require('bookshelf-base'))
  .plugin('virtuals');

exports.register = function (plugin, options, next) {
  plugin.expose('knex', exports.knex);
  plugin.expose('bookshelf', exports.bookshelf);
  plugin.register({
    plugin: require('hapi-bookshelf'),
    options: {
      bookshelf: exports.bookshelf
    }
  }, next);
};

exports.register.attributes = {
  name: 'db'
};
