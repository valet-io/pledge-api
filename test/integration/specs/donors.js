'use strict';

var expect = require('chai').expect;
var server = require('../../server');

describe('Donors', function () {

  describe('POST /donors', function () {

    it('creates a new donor', function () {
      return server.injectThen({
        url: '/donors',
        method: 'post',
        payload: JSON.stringify({
          name: 'Ben Drucker',
          phone: '9739856070',
        })
      })
      .then(function (response) {
        expect(response.statusCode).to.equal(201);
        expect(response.result.id).to.have.length(36);
      });
    });

    it('validates the donor and responds 400 if invalid', function () {
      return server.injectThen({
        url: '/donors',
        method: 'post',
        payload: "{}"
      })
      .then(function (response) {
        expect(response.statusCode).to.equal(400);
        expect(response.result.message).to.equal('name is required');
      });
    });

  });

});
