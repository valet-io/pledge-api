'use strict';

var Joi            = require('joi');
var phoneFormatter = require('phonenumber');

module.exports = function (bookshelf) {
  return bookshelf.model('Donor', bookshelf.Model.extend({
    tableName: 'donors',

    initialize: function () {
      this.on('change', normalizePhone);
    },

    schema: {
      id: Joi.string().guid(),
      created_at: Joi.date(),
      updated_at: Joi.date(),
      name: Joi.string().required(),
      phone: Joi.string(),
      email: Joi.string().email(),
      live: Joi.boolean().default(true)
    }
  }));
};

function normalizePhone (donor) {
  if (donor.get('phone')) donor.set('phone', phoneFormatter.normalize(donor.get('phone')));
}
