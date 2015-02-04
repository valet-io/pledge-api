'use strict';

var expect = require('chai').expect;
var uuid   = require('node-uuid');

module.exports = function (server) {

  describe('Domains', function () {

    var domains = require('../seeds/domains');
    var domain  = domains[0];

    describe('GET /domains/{id}', function () {

      it('can get a domain by id', function () {
        return server.injectThen('/domains/' + domain.id)
          .then(function (response) {
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.payload)).to.have.property('name', 'ourgala.org');
          });
      });

      it('can get a domain by name', function () {
        return server.injectThen('/domains/ourgala.org')
          .then(function (response) {
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.payload)).to.have.property('id', domain.id);
          });
      });

      it('can get the related campaign', function () {
        return server.injectThen('/domains/ourgala.org?expand[]=campaign')
          .then(function (response) {
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(response.payload)).to.have.deep.property('campaign.id').with.length(36);
          });
      });

      it('responds with 404 if the domain is not found', function () {
        return server.injectThen('/domains/theirgala.org')
          .then(function (response) {
            expect(response.statusCode).to.equal(404);
          });
      });

    });

  });

};
