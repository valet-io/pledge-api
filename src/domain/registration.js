'use strict';

module.exports = function (bookshelf) {
  return bookshelf.model('Registration', bookshelf.Model.extend({
    tableName: 'domain_registrations'
  }));
};
