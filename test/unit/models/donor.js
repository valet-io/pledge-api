var expect  = require('chai').expect;
var Promise = require('bluebird');
var Donor   = require('../../../src/models/donor');
var Pledge  = require('../../../src/models/pledge');

describe('Donor', function () {

  var donor;
  beforeEach(function () {
    donor = new Donor();
  });

  it('provides a validation schema', function () {
    donor.set({
      id: 0,
      name: 'Ben',
      phone: '9739856070',
      email: 'ben@valet.io'
    });
    return donor.validate();
  });
  
});