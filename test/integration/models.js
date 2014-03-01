var expect  = require('chai').expect;
var Promise = require('bluebird');
var Pledge  = require('../../src/models/pledge');
var Donor   = require('../../src/models/donor');

describe('Integration: Models', function () {

  describe('Pledge', function () {

    describe('#donor', function () {

      it('belongsTo a Donor', function () {
        return new Donor()
          .save(null, {validate: false})
          .bind({})
          .then(function (donor) {
            this.donor = donor;
            return new Pledge({donor_id: donor.id}).save(null, {validate: false});
          })
          .then(function (pledge) {
            return pledge.load('donor');
          })
          .then(function (pledge) {
            expect(pledge.related('donor')).to.have.property('id', this.donor.id);
          });
      });

    });

  });

  describe('Donor', function () {

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

});