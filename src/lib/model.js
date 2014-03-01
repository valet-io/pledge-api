'use strict';

var DB      = require('./db');
var Joi     = require('joi');
var Promise = require('bluebird');
var _       = require('lodash');

var Model = DB.Model.extend({
  constructor: function () {
    DB.Model.apply(this, arguments);
    this.on('saving', function (model, attrs, options) {
      options = options || {};
      if (options.validate === false) return;
      return this.validate();
    }, this);
  },

  hasTimestamps: true,

  validate: Promise.method(function () {
    if (!this.schema) return;
    if (this.hasTimestamps && !this.schema.created_at) {
      _.extend(this.schema, {
        'created_at': Joi.date(),
        'updated_at': Joi.date()
      });
    }
    var err = Joi.validate(this.toJSON(), this.schema);
    return err ? Promise.reject(err) : err;
  })
});

var base = {
  Model: Model
};

require('bookshelf-authorization')(DB, {
  base: base
});

module.exports = base;