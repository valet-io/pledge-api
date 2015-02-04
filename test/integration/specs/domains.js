'use strict';

var expect = require('chai').expect;
var uuid   = require('node-uuid');
var utils  = require('../utils')

module.exports = function (server) {

  describe('Domains', function () {

    var domains = require('../seeds/domains');
    var domain  = domains[0];

    describe('GET /domains/{id}', function () {

      it('can get a domain by id', function () {
        return server.injectThen('/domains/' + domain.id)
          .tap(utils.assertStatus(200))
          .then(function (response) {
            expect(JSON.parse(response.payload)).to.have.property('name', 'ourgala.org');
          });
      });

      it('can get a domain by name', function () {
        return server.injectThen('/domains/ourgala.org')
          .tap(utils.assertStatus(200))
          .then(function (response) {
            expect(JSON.parse(response.payload)).to.have.property('id', domain.id);
          });
      });

      it('can get the related campaign', function () {
        return server.injectThen('/domains/ourgala.org?expand[]=campaign')
          .tap(utils.assertStatus(200))
          .then(function (response) {
            expect(JSON.parse(response.payload)).to.have.deep.property('campaign.id').with.length(36);
          });
      });

      it('responds with 404 if the domain is not found', function () {
        return server.injectThen('/domains/theirgala.org').then(utils.assertStatus(404));
      });

    });

  });

};
