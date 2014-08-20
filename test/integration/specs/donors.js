'use strict';

var expect = require('chai').expect;
var uuid   = require('node-uuid');
var server = require('../../server');

describe('Donors', function () {

  var donor = require('../seeds/donors')[0];

  describe('POST /donors', function () {

    it('creates a new donor', function () {
      return server.injectThen({
        url: '/donors',
        method: 'post',
        payload: JSON.stringify({
          name: 'Ben Drucker',
          phone: '9739856070'
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
        payload: '{}'
      })
      .then(function (response) {
        expect(response.statusCode).to.equal(400);
        expect(response.result.message).to.equal('name is required');
      });
    });

  });

  describe('/donors', function () {

    it('updates the pledge by ID', function () {
      return server.injectThen({
        url: '/donors/' + donor.id,
        method: 'put',
        payload: JSON.stringify({
          id: donor.id,
          name: donor.name,
          phone: donor.phone,
          email: 'bvdrucker@gmail.com'
        })
      })
      .then(function (response) {
        expect(response.statusCode).to.equal(200);
        expect(JSON.parse(response.payload)).to.have.property('email', 'bvdrucker@gmail.com');
      });

    });

    it('responds with a 400 for non-uuid', function () {
      return server.injectThen({
        method: 'put',
        url: '/donors/a'
      })
      .then(function (response) {
        expect(response.statusCode).to.equal(400);
      });
    });

    it('responds with a 404 if the donor does not exist', function () {
      var id = uuid.v4();
      return server.injectThen({
        method: 'put',
        url: '/donors/' + id,
        payload: JSON.stringify({
          id: id,
          name: donor.name,
          phone: donor.phone,
          email: donor.email
        })
      })
      .then(function (response) {
        expect(response.statusCode).to.equal(404);
      });
    });

    it('it ensures the url id matches the payload id', function () {
      return server.injectThen({
        method: 'put',
        url: '/donors/' + donor.id,
        payload: JSON.stringify({
          id: uuid.v4(),
          name: donor.name,
          phone: donor.phone,
          email: donor.email
        })
      })
      .then(function (response) {
        expect(response.statusCode).to.equal(400);
      });
    });

  });

});
