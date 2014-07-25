'use strict';

var expect = require('chai').expect;
var server = require('../../server');
var uuid   = require('node-uuid');

describe('Batch Endpoint', function () {

  var campaign = require('../seeds/campaigns')[0];
  var donor = require('../seeds/donors')[0];

  it('can create a donor and then a pledge', function () {
    return server.injectThen({
      method: 'post',
      url: '/batch',
      payload: {
        requests: [
          {
            method: 'post',
            path: '/donors',
            payload: {
              name: 'Ben Drucker',
              phone: '9739856070'
            }
          },
          {
            method: 'post',
            path: '/pledges',
            payload: {
              amount: 100,
              donor_id: '$$0.id',
              campaign_id: campaign.id
            },
            references: ['payload']
          }
        ]
      }
    })
    .then(function (response) {
      var payload = JSON.parse(response.payload);
      expect(payload).to.have.length(2);
      var donor = payload[0];
      var pledge = payload[1];
      expect(donor.id).to.have.length(36);
      expect(pledge.id).to.have.length(36);
      expect(pledge.donor_id).to.equal(donor.id);
    });
  });

});
