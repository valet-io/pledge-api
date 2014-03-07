'use strict';

var expect        = require('chai').expect;
var Promise       = require('bluebird');
var serverFactory = require('../../mocks/server');
var pledges       = require('../../../src/routes/pledges');
var Pledge        = require('../../../src/models/pledge');
var Campaign      = require('../../../src/models/campaign');
var Donor         = require('../../../src/models/donor');

describe('Routes: Pledges', function () {

  var server;
  beforeEach(function () {
    server = serverFactory();
    pledges(server);
  });

  var pledge;
  beforeEach(function () {
    pledge = new Pledge({
      amount: 10
    });
    return Promise.all([
      new Campaign().save(null, {validate: false}),
      new Donor().save(null, {validate: false})
    ])
    .spread(function (campaign, donor) {
      return pledge.save({campaign_id: campaign.id, donor_id: donor.id});
    });
  });

  afterEach(function () {
    return pledge.destroy();
  });

  describe('GET /pledges/{id}', function () {

    it('gets the pledge by ID', function () {
      return server.injectThen('/pledges/' + pledge.id)
        .then(function (response) {
          expect(response.result.id).to.equal(pledge.id);
        });
    });

  });

  describe('GET /pledges', function () {

    it('can get the pledges by campaign', function () {
      return new Pledge({
        campaign_id: pledge.get('campaign_id')
      })
      .save(null, {validate: false})
      .then(function () {
        return server.injectThen('/pledges?campaign_id=' + pledge.get('campaign_id'));
      })
      .then(function (response) {
        expect(response.result).to.have.length(2);
        expect(response.result.toJSON()[0].id).to.equal(pledge.id);
      });
    });

  });

  describe('POST /pledges', function () {

    it('creates a new pledge', function () {  
      return Promise.all([
        new Campaign().save(null, {validate: false}),
        new Donor().save(null, {validate: false})
      ])
      .spread(function (campaign, donor) {
        return server.injectThen({
          url: '/pledges',
          method: 'POST',
          payload: JSON.stringify({
            amount: 10,
            campaign_id: campaign.id,
            donor_id: donor.id
          })
        });
      })
      .then(function (response) {
        expect(response.result).to.be.an.instanceOf(Pledge);
        return new Pledge({id: response.result.id}).fetch();
      })
      .then(function (pledge) {
        expect(pledge.get('amount')).to.equal(10);
      });
    });

  });

});