'use strict';

var expect   = require('chai').expect;
var Organization = require('../../../src/models/organization');

describe('Organization', function () {

  var organization;
  beforeEach(function () {
    organization = new Organization();
  });

  it('provides a validation schema', function () {
    organization.set({
      id: 0,
      name: 'My Great Org'
    });
    return organization.validate();
  });
  
});