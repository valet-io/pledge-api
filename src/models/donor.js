'use strict';

var Joi            = require('joi');
var Model          = require('../lib/model').Model;
var phoneFormatter = require('phonenumber');

var internals = {};

var Donor = Model.extend({
  tableName: 'donors',

  initialize: function () {
    this.on('change', internals.normalizePhone);
  },

  schema: {
    id: Joi.number().integer().min(0),
    name: Joi.string().required(),
    phone: Joi.string(),
    email: Joi.string().email()
  },

  pledges: function () {
    return this.hasMany(require('./pledge'));
  }

});

internals.normalizePhone = function (donor) {
  if (donor.get('phone')) donor.set('phone', phoneFormatter.normalize(donor.get('phone')));
};

module.exports = Donor;