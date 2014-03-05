var Joi   = require('joi');
var Model = require('../lib/model').Model;

var Campaign = Model.extend({
  tableName: 'campaigns',

  schema: {
    id: Joi.number().integer().min(0),
    name: Joi.string().required(),
    metadata: Joi.object()
  },

  pledges: function () {
    return this.hasMany(require('./pledge'));
  }

});

module.exports = Campaign;