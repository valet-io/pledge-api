var Joi   = require('joi');
var Model = require('../lib/model').Model;

var Organization = Model.extend({
  tableName: 'organizations',

  schema: {
    id: Joi.number().integer().min(0),
    name: Joi.string().required()
  }

});

module.exports = Organization;