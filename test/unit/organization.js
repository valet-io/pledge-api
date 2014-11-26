'use strict';

var expect = require('chai').expect;

module.exports = function (Organization) {

  describe('Organization', function () {

    var organization;
    beforeEach(function () {
      organization = new Organization();
    });

    it('exposes the stripe publishable key', function () {
      organization.related('stripe').set('stripe_publishable_key', 'spk');
      expect(organization.toJSON()).to.deep.equal({
        stripe: {
          publishable_key: 'spk'
        }
      });
    });
    
  });

};

