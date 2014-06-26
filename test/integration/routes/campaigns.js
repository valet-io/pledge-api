'use strict';

var expect    = require('chai').expect;
var Promise   = require('bluebird');
var server    = require('../../server');
var Campaign  = require('../../../src/models/campaign');

describe('Routes: Campaigns', function () {

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

    it('gets the campaign by ID', function () {
      return server.injectThen('/campaigns/' + campaign.id)
        .then(function (response) {
          expect(response.result.id).to.equal(campaign.id);
        });
    });

  });

});
