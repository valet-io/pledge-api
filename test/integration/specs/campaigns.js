'use strict';

var expect = require('chai').expect;
var uuid   = require('node-uuid');

module.exports = function (server) {

  describe('Campaigns', function () {

    var campaigns = require('../seeds/campaigns');
    var campaign  = campaigns[0];

    describe('GET /campaigns', function () {

      it('gets a list of campaigns', function () {
        return server.injectThen('/campaigns')
          .then(function (response) {
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.payload)).to.have.length(campaigns.length);
          });
      });

    });

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

      it('can get the campaign with the domain', function () {
        return server.injectThen('/campaigns/' + campaign.id + '?expand[]=domain')
          .then(function (response) {
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.payload))
              .to.have.deep.property('domain.id')
              .with.length(36);
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

};
