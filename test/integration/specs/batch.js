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
      payload: JSON.stringify({
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
              donor_id: '$0.id',
              campaign_id: campaign.id
            }
          }
        ]
      })
    })
    .then(function (response) {
      console.log(response.result);
    });
  });

});
