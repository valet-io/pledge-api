'use strict';

var expect     = require('chai').expect;
var uuid       = require('node-uuid');
var proxyquire = require('proxyquire').noPreserveCache();

var Campaign   = proxyquire('../../../src/models/campaign', {
  firebase: require('mockfirebase').MockFirebase
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
      payments: true,
      metadata: {
        title: 'tbd'
      }
    });
    return campaign.validate();
  });

  describe('#firebase', function () {

    it('can provide its firebase reference', function () {
      var base = require('../../../config').get('firebase');
      campaign.id = uuid.v4();
      var endpoint = base + '/campaigns/' + campaign.id;
      expect(campaign.firebase().currentPath).to.equal(endpoint);
    });

  });
  
});
