'use strict';

module.exports = function (bookshelf) {
  return bookshelf.model('Domain', bookshelf.Model.extend({
    tableName: 'domains',
    campaign: function () {
      return this.hasOne('Campaign');
    },
    registration: function () {
      return this.belongsTo('Registration', 'registration_id');
    }
  }));
};
