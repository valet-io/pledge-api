'use strict';

var Joi            = require('joi');
var bookshelf      = require('../db');
var Model          = bookshelf.Model;
var phoneFormatter = require('phonenumber');

var internals = {};

var Donor = Model.extend({
  tableName: 'donors',

  initialize: function () {
    this.on('change', internals.normalizePhone);
  },

  schema: {
    id: Joi.string().guid(),
    created_at: Joi.date(),
    updated_at: Joi.date(),
    name: Joi.string().required(),
    phone: Joi.string(),
    email: Joi.string().email(),
    live: Joi.boolean().default(true)
  },

  pledges: function () {
    return this.hasMany('Pledge');
  }

});

internals.normalizePhone = function (donor) {
  if (donor.get('phone')) donor.set('phone', phoneFormatter.normalize(donor.get('phone')));
};

module.exports = bookshelf.model('Donor', Donor);
