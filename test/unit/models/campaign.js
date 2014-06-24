'use strict';

var expect   = require('chai').expect;
var uuid     = require('node-uuid');
var Campaign = require('../../../src/models/campaign');

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
  
});
