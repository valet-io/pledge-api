'use strict';

var expect = require('chai').expect;
var uuid   = require('node-uuid');

module.exports = function (server) {
  describe('Batch Endpoint', function () {

    var campaign = require('../seeds/campaigns')[0];
    var donor = require('../seeds/donors')[0];

    it('can create a donor and then a pledge', function () {
      var donorId = uuid.v4();
      return server.injectThen({
        method: 'post',
        url: '/batch',
        payload: JSON.stringify({
          parallel: false,
          requests: [
            {
              method: 'post',
              path: '/donors',
              payload: {
                id: donorId,
                name: 'Ben Drucker',
                phone: '9739856070'
              }
            },
            {
              method: 'post',
              path: '/pledges',
              payload: {
                id: uuid.v4(),
                amount: 100,
                donor_id: donorId,
                campaign_id: campaign.id
              }
            }
          ]
        })
      })
      .then(function (response) {
        var payload = JSON.parse(response.payload);
        expect(payload).to.have.length(2);
        donor = payload[0];
        var pledge = payload[1];
        expect(donor.id).to.have.length(36);
        expect(pledge.id).to.have.length(36);
        expect(pledge.donor_id).to.equal(donor.id);
      });
    });

  });
};


