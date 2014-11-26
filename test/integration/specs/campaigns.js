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

      it('can filter the list by host', function () {
        return server.injectThen('/campaigns?host=' + campaign.host)
          .then(function (response) {
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.payload)).to.have.length(1);
          });
      });

      it('can responds with 400 for an invalid host', function () {
        return server.injectThen('/campaigns?host=//')
          .then(function (response) {
            expect(response.statusCode).to.equal(400);
          });
      });

      it('disallows arbitrary query parameters', function () {
        return server.injectThen('/campaigns?foo=bar')
          .then(function (response) {
            expect(response.statusCode).to.equal(400);
          });
      });

      it('responds with an empty array if there are no results', function () {
        return server.injectThen('/campaigns?host=foo.com')
          .then(function (response) {
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.payload)).to.have.length(0);
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
