'use strict';

var Joi       = require('joi');
var bookshelf = require('../db')
var Model     = bookshelf.Model;

var Organization = Model.extend({
  tableName: 'organizations',

  schema: {
    id: Joi.string().guid(),
    name: Joi.string().required(),
    created_at: Joi.date(),
    updated_at: Joi.date()
  }

});

module.exports = bookshelf.model('Organization', Organization);
