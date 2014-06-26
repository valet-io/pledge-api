var Joi   = require('joi');
var Model = require('../db').Model;

var Organization = Model.extend({
  tableName: 'organizations',

  schema: {
    id: Joi.string().guid(),
    name: Joi.string().required()
  }

});

module.exports = Organization;
