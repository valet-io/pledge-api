'use strict';

var expect   = require('chai').expect;
var uuid     = require('node-uuid');
var server   = require('../../server');

describe('SMS', function () {

  describe('POST /messages', function () {

    it('can create an outbound SMS message', function () {
      return server.injectThen({
        url: '/messages',
        method: 'post',
        payload: JSON.stringify({
          created_at: new Date(),
          updated_at: new Date(),
          to_number: '9739856070',
          direction: 'outbound',
          body: 'Hello world!'
        })
      })
      .then(function (response) {
        expect(response.statusCode).to.equal(201);
        expect(response.result.id).to.have.length(36);
      });
    });

  });

});
