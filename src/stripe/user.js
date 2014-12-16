'use strict';

module.exports = function (bookshelf) {
  return bookshelf.model('StripeUser', bookshelf.Model.extend({
    tableName: 'stripe_users',
    idAttribute: 'stripe_user_id',
    virtuals: {
      connect: function () {
        return !!this.id;
      }
    }
  }));
};
