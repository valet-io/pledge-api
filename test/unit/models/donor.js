var expect  = require('chai').expect;
var Promise = require('bluebird');
var uuid    = require('node-uuid');
var Donor   = require('../../../src/models/donor');
var Pledge  = require('../../../src/models/pledge');

describe('Donor', function () {

  var donor;
  beforeEach(function () {
    donor = new Donor();
  });

  it('provides a validation schema', function () {
    donor.set({
      id: uuid.v4(),
      name: 'Ben',
      phone: '9739856070',
      email: 'ben@valet.io'
    });
    return donor.validate();
  });

  it('normalizes phone numbers', function () {
    [
      '(973) 985 6070',
      '973-985-6070',
      '973.985.6070',
      '973 985 6070'
    ]
    .forEach(function (input) {
      donor.set('phone', input);
      expect(donor.get('phone')).to.equal('+19739856070');
    });
  });
  
});
