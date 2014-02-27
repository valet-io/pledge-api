'use strict';

var DB  = require('./db');
var Joi = require('joi');

module.exports = DB.Model.extend({
  constructor: function () {
    this.on('saving', this.validate, this);
  },

  validate: function () {
    if (this.schema) {
      Joi.validate(this.toJSON(), this.schema);
    }
  }
});