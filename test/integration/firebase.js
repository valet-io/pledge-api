'use strict';

var expect     = require('chai').expect;
var Promise    = require('bluebird');
var Pledge     = require('../../src/models/pledge');
var Campaign   = require('../../src/models/campaign');
var Donor      = require('../../src/models/donor');
var Firebase   = require('../mocks/firebase-integration');

describe('Integration: Firebase', function () {

  before(function () {
    Pledge._events = {};
    require('../../src/lib/firebase')(Firebase);
  });

  after(function () {
    Pledge._events = {};
  });

  describe('Pledges', function () {

    var pledges, donor, campaign, campaignRef;

    before(function () {
      return Promise.all([
        new Donor().save({
          name: 'Ben'
        },
        {
          validate: false
        })
        .then(function (_donor_) {
          donor = _donor_;
        }),
        new Campaign().save(null, {
          validate: false
        })
        .then(function (_campaign_) {
          campaign = _campaign_;
          campaignRef = new Firebase('https://valet-io-test.firebaseio.com/campaigns/' + campaign.id);
        })
      ]);
    });

    before(function () {
      pledges = [
        new Pledge({
          donor_id: donor.id,
          campaign_id: campaign.id,
          anonymous: false,
          amount: 10
        }),
        new Pledge({
          donor_id: donor.id,
          campaign_id: campaign.id,
          anonymous: false,
          amount: 20
        })
      ];
    });

    describe('on "created"', function () {

      before(function () {
        return Promise.map(pledges, function (pledge) {
          return pledge.save(null, {validate: false});
        });
      });

      var fireCampaign;
      before(function (done) {
        campaignRef.once('value', function (snapshot) {
          fireCampaign = snapshot.val();
          done();
        });
      });

      it('saves the pledges', function () {
        expect(fireCampaign.pledges).to.have.keys(pledges.map(function (pledge) {
          return pledge.id.toString();
        }));
      });

      it('saves the toFirebase representation only', function () {
        pledges.forEach(function (pledge) {
          var toFirebase = pledge.toFirebase();
          delete toFirebase.anonymous;
          expect(fireCampaign.pledges[pledge.id]).to.deep.equal(toFirebase);
        });
      });

      it('updates the total', function () {
        expect(fireCampaign.aggregates.total).to.equal(30);
      });

      it('updates the count', function () {
        expect(fireCampaign.aggregates.count).to.equal(2);
      });

    });

  });

});