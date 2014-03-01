'use strict';

var DB  = require('./db');
var Joi = require('joi');
var _   = require('lodash');

var Model = DB.Model.extend({
  constructor: function () {
    DB.Model.apply(this, arguments);
    this.on('saving', function () {
      return this.validate();
    }, this);
  },

  hasTimestamps: true,

  validate: function () {
    if (this.schema) {
      if (this.hasTimestamps && !this.schema['created_at']) {
        _.extend(this.schema, {
          'created_at': Joi.date(),
          'updated_at': Joi.date()
        });
      }
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