var Joi   = require('joi');
var Model = require('../db').Model;

var Organization = Model.extend({
  tableName: 'organizations',

  schema: {
    id: Joi.string().guid(),
    name: Joi.string().required(),
    created_at: Joi.date(),
    updated_at: Joi.date()
  }

});

module.exports = Organization;
