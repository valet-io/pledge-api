'use strict';

var expect     = require('chai').expect;
var sinon      = require('sinon');
var Firebase   = require('../../mocks/firebase');
var Pledge     = require('../../../src/models/pledge');
var pledgeMock = require('../../mocks/pledge');
var firePledge = require('../../../src/lib/firebase')(Firebase);

describe('Firebase', function () {

  var campaignsRef = Firebase.getCall(0).returnValue;
  var baseUrl = 'https://valet-io-events.firebaseio.com/campaigns';

  describe('Setup', function () {

    it('creates a Firebase reference to the campaign endpoint', function () {
      expect(Firebase).to.have.been.calledWith(baseUrl);
      expect(Firebase).to.have.been.calledWithNew;
    });

  });
  
  describe('Pledges', function () {

    describe('on "created"', function () {

      var trigger = function () {
        return Pledge.triggerThen('created', pledgeMock);
      };

      var sandbox;
      beforeEach(function () {
        sandbox = sinon.sandbox.create();
      });

      afterEach(function () {
        sandbox.restore();
      });

      var campaignUrl = baseUrl + '/' + pledgeMock.campaign().id;

      it('loads the campaign and donor metadata', function () {
        sandbox.spy(pledgeMock, 'load');
        return trigger().finally(function () {
          expect(pledgeMock.load).to.have.been.calledWithMatch(['campaign', 'donor']);
        });
      });

      it('sets the pledge in Firebase using its #toFirebase response', function () {
        var set = sandbox.spy(Firebase.prototype, 'set');
        return trigger().finally(function () {
          expect(set).to.have.been.calledWith(pledgeMock.toFirebase());
          expect(set).to.have.been.calledOn(sinon.match.has('_ref', 
            campaignUrl + '/pledges/' + pledgeMock.id
          ));
        });
      });

      it('updates the total for the campaign', function () {
        var transaction = sandbox.spy(Firebase.prototype, 'transaction');
        return trigger().finally(function () {
          expect(transaction).to.have.been.calledOn(sinon.match.has('_ref', campaignUrl + '/aggregates/total'));
          expect(transaction).to.have.been.calledOn(sinon.match.has('_val', 10));
        });
      });

      it('updates the count for the campaign', function () {
        var transaction = sandbox.spy(Firebase.prototype, 'transaction');
        return trigger().finally(function () {
          expect(transaction).to.have.been.calledOn(sinon.match.has('_ref', campaignUrl + '/aggregates/count'));
          expect(transaction).to.have.been.calledOn(sinon.match.has('_val', 10));
        });
      });

    });

  });

});