'use strict';

var expect       = require('chai').expect;
var uuid         = require('node-uuid');
var Organization = require('../../../src/organization/organization');
require('../../../src/organization/stripe');

describe('Organization', function () {

  var organization;
  beforeEach(function () {
    organization = new Organization();
  });

  it('provides a validation schema', function () {
    organization.set({
      id: uuid.v4(),
      name: 'My Great Org'
    });
    return organization.validate();
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
