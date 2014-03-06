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
  beforeEach(function () {
    campaign = new Campaign({
      name: 'My Campaign'
    });
    return campaign.save();
  });

  afterEach(function () {
    return campaign.destroy();
  });

  describe('GET /campaigns/{id}', function () {

    it('gets the campaign by ID', function (done) {
      server.inject('/campaigns/' + campaign.id, function (response) {
        expect(response.result.id).to.equal(campaign.id);
        done();
      });
    });

  });

  describe('GET /campaigns', function () {

    it('can get the campaign by host', function () {
      return campaign.save({
        host: 'myhost.org'
      })
      .then(function (campaign) {
        server.inject('/campaigns?host=myhost.org', function (response) {
          expect(response.result).to.have.length(1);
          expect(response.result.toJSON()[0].id).to.equal(campaign.id);
        });
      });
    });

  });

});