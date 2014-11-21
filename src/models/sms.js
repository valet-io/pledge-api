'use strict';

var Joi   = require('joi');
var Model = require('../db').Model;

module.exports = Model.extend({
  tableName: 'sms_messages'
});
