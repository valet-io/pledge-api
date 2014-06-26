'use strict';

var expect       = require('chai').expect;
var uuid         = require('node-uuid');
var Organization = require('../../../src/models/organization');

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
  
});
