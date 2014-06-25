'use strict';

var expect     = require('chai').expect;
var uuid       = require('node-uuid');
var proxyquire = require('proxyquire');

var Campaign   = proxyquire('../../../src/models/campaign', {
  Firebase: require('mockfirebase')
});

describe('Campaign', function () {

  var campaign;
  beforeEach(function () {
    campaign = new Campaign();
  });

  it('provides a validation schema', function () {
    campaign.set({
      id: uuid.v4(),
      name: 'The Greatest Fundraiser Ever',
      host: 'myhost.org',
      metadata: {
        title: 'tbd'
      }
    });
    return campaign.validate();
  });

  describe('#firebase', function () {

    it('can provide its firebase reference', function () {
      campaign.id = uuid.v4();
      expect(campaign.firebase().name()).to.equal(campaign.id);
    });

  });
  
});
