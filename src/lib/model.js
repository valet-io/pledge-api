'use strict';

var DB  = require('./db');
var Joi = require('joi');

var Model = DB.Model.extend({
  constructor: function () {
    DB.Model.apply(this, arguments);
    this.on('saving', function () {
      return this.validate();
    }, this);
  },

  validate: function () {
    if (this.schema) {
      return Joi.validate(this.toJSON(), this.schema);
    }
  }
});

var base = {
  Model: Model
};

require('bookshelf-authorization')(DB, {
  base: base
});

module.exports = base;