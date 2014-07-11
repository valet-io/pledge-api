'use strict';

var expect = require('chai').expect;
var server = require('../../server');
var uuid   = require('node-uuid');

describe('Campaigns', function () {

  var campaign = require('../seeds/campaigns')[0];

  describe('GET /campaigns/{id}', function () {

    it('gets the campaign by ID', function () {
      return server.injectThen('/campaigns/' + campaign.id)
        .then(function (response) {
          expect(response.statusCode).to.equal(200);
          expect(response.result.id).to.equal(campaign.id);
          expect(JSON.parse(response.payload).metadata)
            .to.deep.equal(JSON.parse(campaign.metadata));
        });
    });

    it('responds with a 400 for non-uuid', function () {
      return server.injectThen('/campaigns/1')
        .then(function (response) {
          expect(response.statusCode).to.equal(400);
        });
    });

    it('responds with 404 if the campaign is not found', function () {
      return server.injectThen('/campaigns/' + uuid.v4())
        .then(function (response) {
          expect(response.statusCode).to.equal(404);
        });
    });

  });

});
