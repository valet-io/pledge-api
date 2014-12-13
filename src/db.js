'use strict';

exports.knex = require('knex')(require('./config').get('database'));

exports.bookshelf = require('bookshelf')(exports.knex)
  .plugin('registry')
  .plugin(require('bookshelf-base'))
  .plugin('virtuals');

exports.bookshelf.Model.prototype.validate = function () {};

exports.register = function (server, options, next) {
  server.expose('knex', exports.knex);
  server.expose('bookshelf', exports.bookshelf);
  server.register({
    register: require('hapi-bookshelf'),
    options: {
      bookshelf: exports.bookshelf
    }
  }, next);
};

exports.register.attributes = {
  name: 'db'
};
