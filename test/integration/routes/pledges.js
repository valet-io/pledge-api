'use strict';

var expect   = require('chai').expect;
var Promise  = require('bluebird');
var server   = require('../../server');
var Pledge   = require('../../../src/models/pledge');
var Campaign = require('../../../src/models/campaign');
var Donor    = require('../../../src/models/donor');

describe('Routes: Pledges', function () {

  var pledge;
  beforeEach(function () {
    pledge = new Pledge({
      amount: 10
    });
    return Promise.all([
      new Campaign().save(null, {validation: false}),
      new Donor().save(null, {validation: false})
    ])
    .spread(function (campaign, donor) {
      return pledge.save({campaign_id: campaign.id, donor_id: donor.id});
    });
  });

  afterEach(function () {
    return pledge.destroy();
  });

  describe('GET /pledges/{id}', function () {

    it('gets the pledge by ID', function () {
      return server.injectThen('/pledges/' + pledge.id)
        .then(function (response) {
          expect(response.result.id).to.equal(pledge.id);
        });
    });

  });

  describe('POST /pledges', function () {

    it('creates a new pledge and donor', function () {  
      return Promise.all([
        new Campaign().save(null, {validation: false}),
        new Donor().save(null, {validation: false})
      ])
      .spread(function (campaign, donor) {
        return server.injectThen({
          url: '/pledges',
          method: 'POST',
          payload: JSON.stringify({
            amount: 10,
            campaign_id: campaign.id,
            donor: {
              name: 'Ben Drucker',
              phone: '9739856070'
            }
          })
        });
      })
      .then(function (response) {
        expect(response.result).to.be.an.instanceOf(Pledge);
        expect(response.result.get('amount')).to.equal(10);
      });
    });

  });

});
