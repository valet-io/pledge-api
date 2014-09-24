'use strict';

var expect   = require('chai').expect;
var uuid     = require('node-uuid');
var moment   = require('moment');
var server   = require('../../server');

describe('Pledges', function () {

  var pledges = require('../seeds/pledges');
  var pledge = pledges[0];
  var donor = require('../seeds/donors')[0];

  describe('GET /pledges/{id}', function () {

    it('gets the pledge by ID', function () {
      return server.injectThen('/pledges/' + pledge.id)
        .then(function (response) {
          expect(response.statusCode).to.equal(200);
          expect(response.result.id).to.equal(pledge.id);
        });
    });

    it('can get the pledge with related data', function () {
      return server.injectThen('/pledges/' + pledge.id + '?expand[0]=donor')
        .then(function (response) {
          expect(response.statusCode).to.equal(200);
          var payload = JSON.parse(response.payload);
          expect(payload)
            .to.have.property('donor')
            .with.property('id', donor.id);
        });
    });

    it('responds with a 400 for non-uuid', function () {
      return server.injectThen('/pledges/1')
        .then(function (response) {
          expect(response.statusCode).to.equal(400);
        });
    });

    it('responds with 404 if the pledge is not found', function () {
      return server.injectThen('/pledges/' + uuid.v4())
        .then(function (response) {
          expect(response.statusCode).to.equal(404);
        });
    });

  });

  describe('GET /pledges', function () {

    it('can get all unpaid pledges', function () {
      return server.injectThen({
        url: '/pledges?paid=false&expand[0]=donor',
        method: 'get'
      })
      .then(function (response) {
        expect(response.statusCode).to.equal(200);
        var payload = JSON.parse(response.payload);
        expect(payload).to.have.length(2);
        expect(payload.map(function (pledge) {
          return pledge.id;
        }))
        // plain old unpaid
        .to.include(pledges[1].id)
        // a payment attempt, but failed
        .and.include(pledges[2].id);
        expect(payload[0].donor.id).to.have.length(36);
      });
    });

  });

  describe('POST /pledges', function () {

    var campaign = require('../seeds/campaigns')[0];

    it('creates a new pledge', function () {
      return server.injectThen({
        url: '/pledges',
        method: 'post',
        payload: JSON.stringify({
          campaign_id: campaign.id,
          donor_id: donor.id,
          amount: 1,
          submitted_at: moment().subtract('seconds', 1),
          started_at: moment().subtract('seconds', 20)
        })
      })
      .then(function (response) {
        expect(response.statusCode).to.equal(201);
        expect(response.result.id).to.have.length(36);
      });
    });

    it('validates the pledge and responds 400 if invalid', function () {
      return server.injectThen({
        url: '/pledges',
        method: 'post',
        payload: JSON.stringify({
          donor_id: donor.id,
          amount: 1,
          submitted_at: moment().subtract('seconds', 1),
          started_at: moment().subtract('seconds', 20)
        })
      })
      .then(function (response) {
        expect(response.statusCode).to.equal(400);
        expect(response.result.message).to.equal('campaign_id is required');
      });
    });

  });

  describe('PUT /pledges', function () {

    it('updates the pledge by ID', function () {
      return server.injectThen({
        url: '/pledges/' + pledge.id,
        method: 'put',
        payload: JSON.stringify({
          id: pledge.id,
          campaign_id: pledge.campaign_id,
          donor_id: pledge.donor_id,
          amount: pledge.amount,
          submitted_at: moment().subtract('seconds', 1),
          started_at: moment().subtract('seconds', 20)
        })
      })
      .then(function (response) {
        expect(response.statusCode).to.equal(200);
        expect(JSON.parse(response.payload))
          .to.have.property('submitted_at')
          .that.is.a('string');
      });

    });

    it('responds with a 400 for non-uuid', function () {
      return server.injectThen({
        method: 'put',
        url: '/pledges/a'
      })
      .then(function (response) {
        expect(response.statusCode).to.equal(400);
      });
    });

    it('responds with a 404 if the pledge does not exist', function () {
      var id = uuid.v4();
      return server.injectThen({
        method: 'put',
        url: '/pledges/' + id,
        payload: JSON.stringify({
          id: id,
          campaign_id: pledge.campaign_id,
          donor_id: pledge.donor_id,
          amount: pledge.amount
        })
      })
      .then(function (response) {
        expect(response.statusCode).to.equal(404);
      });
    });

    it('it ensures the url id matches the payload id', function () {
      return server.injectThen({
        method: 'put',
        url: '/pledges/' + pledge.id,
        payload: JSON.stringify({
          id: uuid.v4(),
          campaign_id: pledge.campaign_id,
          donor_id: pledge.donor_id,
          amount: pledge.amount
        })
      })
      .then(function (response) {
        expect(response.statusCode).to.equal(400);
      });
    });

  });

});
