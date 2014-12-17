'use strict';

var Promise = require('bluebird');
var expect  = require('chai').expect;
var sinon   = require('sinon');

module.exports = function (server) {

  var ref = server.plugins.firebase.ref;
  beforeEach(function () {
    ref.autoFlush();
    ref.set(null);
  });

  describe('Pledge', function () {

    var Pledge = server.plugins.pledge.Pledge;

    var pledge;
    beforeEach(function () {
      pledge = new Pledge({
        id: 'pledgeId',
        campaign_id: 'campaignId',
        amount: 5,
        live: true
      });
      ref.child('campaigns/campaignId/live/aggregates').set({
        total: 100,
        count: 10
      });
      ref.child('campaigns/campaignId/test/aggregates').set({
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
            data = ref.getData().campaigns.campaignId.live;
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
        expect(ref.child('campaigns/campaignId/live/pledges/pledgeId').priority)
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

      it('handles test pledges', function () {
        return pledge.set('live', false)
          .triggerThen('created', pledge)
          .then(function () {
            expect(ref.getData().campaigns.campaignId)
              .to.have.property('test')
              .and.deep.equal({
                aggregates: {
                  total: 105,
                  count: 11
                },
                pledges: {
                  pledgeId: {
                    created_at: input.created_at,
                    amount: 5
                  }
                }
              });
          });
      });

    });

    describe('updated', function () {

      var data;
      beforeEach(function () {
        return pledge.triggerThen('updated', pledge)
          .then(function () {
            data = ref.getData().campaigns.campaignId.live;
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

    var Campaign = server.plugins.campaign.Campaign;

    it('creates the campaign with defaults', function () {
      var campaign = new Campaign({
        id: 'campaignId'
      });
      return campaign.triggerThen('created', campaign)
        .then(function () {
          var defaults = {
            aggregates: {
              total: 0,
              count: 0
            },
            options: {
              starting_value: 0
            }
          };
          expect(ref.child('campaigns/campaignId').getData()).to.deep.equal({
            live: defaults,
            test: defaults
          });
        });
    });

  });

  describe('Auth', function () {

    it('prevents the server from starting if auth fails', function (done) {
      var err = new Error();
      ref.failNext('auth', err);
      sinon.spy(ref, 'auth');
      server.settings.app.config.set('firebase.secret', 'fbs');
      server.start(function (_err_) {
        expect(ref.auth).to.have.been.calledWith('fbs');
        expect(err).to.equal(_err_);
        server.stop(done);
      });
    });

  });

};
