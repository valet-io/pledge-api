'use strict';

var Promise = require('bluebird');
var expect  = require('chai').expect;
var sinon   = require('sinon');

module.exports = function (server) {

  var Pledge = server.plugins.pledge.Pledge;
  var Donor  = server.plugins.donor.Donor;
  var ref    = server.plugins.firebase.ref;

  describe('Pledge', function () {

    var pledge;
    beforeEach(function () {
      pledge = new Pledge({
        id: 'pledgeId',
        campaign_id: 'campaignId',
        amount: 5
      });
      ref.autoFlush();
      ref.set(null);
      ref.child('campaigns/campaignId/aggregates').set({
        total: 100,
        count: 10
      });
    });

    describe('created', function () {

      var input, data;
      beforeEach(function () {
        input = {
          created_at: Date.now(),
          amount: 5
        };
        sinon.stub(pledge, 'load').resolves(pledge);
        sinon.stub(pledge, 'toFirebase').returns(input);
        return pledge.triggerThen('created', pledge)
          .then(function () {
            data = ref.getData().campaigns.campaignId;
          });
      });

      it('sets the pledge data inside the campaign', function () {
        expect(data)
          .to.have.deep.property('pledges.pledgeId')
          .that.deep.equals({
            created_at: input.created_at,
            amount: 5
          });
      });

      it('sets the pledge priority as the timestamp', function () {
        expect(ref.child('campaigns/campaignId/pledges/pledgeId').priority)
          .to.equal(input.created_at);
      });

      it('increments the total', function () {
        expect(data)
          .to.have.deep.property('aggregates.total', 105);
      });

      it('increments the count', function () {
        expect(data)
          .to.have.deep.property('aggregates.count', 11);
      });

    });

    describe('updated', function () {

      var data;
      beforeEach(function () {
        return pledge.triggerThen('updated', pledge)
          .then(function () {
            data = ref.getData().campaigns.campaignId;
          });
      });

      it('updates the amount on the pledge', function () {
        expect(data)
          .to.have.deep.property('pledges.pledgeId.amount', 5);
      });

      it('updates the aggregate total', function () {
        expect(data)
          .to.have.deep.property('aggregates.total', 105);
      });

    });

  });

  describe('Campaign', function () {

  });

  describe('Auth', function () {

  });

};
