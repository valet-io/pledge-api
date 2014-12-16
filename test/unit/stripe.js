'use strict';

var expect = require('chai').expect;

module.exports = function (ConnectUser) {

  describe('Stripe Connect', function () {

    it('adds a "connect" property', function () {
      var user = new ConnectUser({
        stripe_user_id: 'acc_123'
      });
      expect(user.toJSON()).to.have.property('connect', true);
      user = new ConnectUser();
      expect(user.toJSON()).to.have.property('connect', false);
    });

  });

};
