'use strict';

var expect  = require('chai').expect;

module.exports = function (Donor) {

  describe('Donor', function () {

    var donor;
    beforeEach(function () {
      donor = new Donor();
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

};

