var Joi   = require('joi');
var Model = require('../lib/model').Model;

var Donor = Model.extend({
  tableName: 'donors',

  schema: {
    id: Joi.number().integer().min(0),
    name: Joi.string().required(),
    phone: Joi.string().length(10),
    email: Joi.string().email()
  },

  pledges: function () {
    return this.hasMany(require('./pledge'));
  }

});

module.exports = Donor;