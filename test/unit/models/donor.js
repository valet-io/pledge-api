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
    expect(donor.validate()).to.be.null;
  });

  describe('#pledges', function () {

    it('hasMany pledges', function () {
      return new Donor().save(null, {validate: false})
        .bind({})
        .then(function (donor) {
          this.donor = donor;
          return Promise.all([
            new Pledge({donor_id: donor.id}).save(null, {validate: false}),
            new Pledge({donor_id: donor.id}).save(null, {validate: false})
          ]);
        })
        .then(function () {
          return this.donor.load('pledges');
        })
        .then(function (donor) {
          expect(donor.related('pledges')).to.have.length(2);
        });
    });

  });

});