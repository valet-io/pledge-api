'use strict';

var expect    = require('chai').expect;
var Promise   = require('bluebird');
var Server    = require('../../mocks/server');
var campaigns = require('../../../src/routes/campaigns');
var Campaign  = require('../../../src/models/campaign');

describe('Routes: Campaigns', function () {

  var server;
  beforeEach(function () {
    server = new Server();
    campaigns(server);
  });

  var campaign;
  before(function () {
    return new Campaign().save(null, {validate: false})
      .call('fetch')
      .then(function (_campaign_) {
        campaign = _campaign_;
      });
  });

  describe('GET /campaigns/{id}', function () {

    it('gets the campaign by ID', function (done) {
      server.inject('/campaigns/' + campaign.id, function (response) {
        expect(response.result.toJSON()).to.deep.equal(campaign.toJSON());
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

  });

})