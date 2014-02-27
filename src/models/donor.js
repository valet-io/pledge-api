var Joi   = require('joi');
var Model = require('../lib/model').Model;

var Donor = Model.extend({
  tableName: 'donors',
  hasTimestamps: true
});

module.exports = Donor;