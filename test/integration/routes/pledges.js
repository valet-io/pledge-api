'use strict';

var expect    = require('chai').expect;
var Promise   = require('bluebird');
var Server    = require('../../mocks/server');
var pledges   = require('../../../src/routes/pledges');
var Pledge    = require('../../../src/models/pledge');
var Campaign  = require('../../../src/models/campaign');
var Donor     = require('../../../src/models/donor');

describe('Routes: Pledges', function () {

  var server;
  beforeEach(function () {
    server = new Server();
    pledges(server);
  });

  var pledge;
  beforeEach(function () {
    pledge = new Pledge({
      amount: 10
    });
    return Promise.all([
      new Campaign().save(null, {validate: false}),
      new Donor().save(null, {validate: false})
    ])
    .spread(function (campaign, donor) {
      return pledge.save({campaign_id: campaign.id, donor_id: donor.id});
    });
  });

  afterEach(function () {
    return pledge.destroy();
  });

  describe('GET /pledges/{id}', function () {

    it('gets the pledge by ID', function (done) {
      server.inject('/pledges/' + pledge.id, function (response) {
        expect(response.result.id).to.equal(pledge.id);
        done();
      });
    });

  });

  describe('GET /pledges', function () {

    it('can get the pledges by campaign', function () {
      new Pledge({
        campaign_id: pledge.get('campaign_id')
      })
      .save(null, {validate: false})
      .then(function () {
        server.inject('/pledges?campaign_id=' + pledge.get('campaign_id'), function (response) {
          expect(response.result).to.have.length(2);
          expect(response.result.toJSON()[0].id).to.equal(pledge.id);
        });
      });
    });

  });

});