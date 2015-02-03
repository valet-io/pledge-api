'use strict';

var expect = require('chai').expect;
var uuid   = require('node-uuid');

module.exports = function (server) {

  describe('Domains', function () {

    var domains = require('../seeds/domains');
    var domain  = domains[0];

    describe('GET /domains/{id}', function () {

      it('can get a domain by id');

      it('can get a domain by name');

      it('can get the related campaign');

      it('excludes inactive domains when searching by name');

    });

  });

};
