var expect     = require('chai').expect;
var Firebase   = require('../../mocks/firebase');
var firePledge = require('../../../src/lib/firebase')(Firebase);

describe('Firebase', function () {

  afterEach(function () {
    Firebase.reset();
  });

  describe('Setup', function () {

    it('creates a Firebase reference to the campaign endpoint', function () {
      expect(Firebase).to.have.been.calledWith('https://valet-io-events.firebaseio.com/campaigns/');
    });

  });
  
  describe('Pledges', function () {

    describe('on "created"')

  });

});