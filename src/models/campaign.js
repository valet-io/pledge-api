var Joi   = require('joi');
var Model = require('../lib/model').Model;

var Campaign = Model.extend({
  tableName: 'campaigns',

  schema: {
    id: Joi.number().integer().min(0),
    name: Joi.string().required(),
    host: Joi.string().max(20),
    metadata: Joi.object()
  },

  pledges: function () {
    return this.hasMany(require('./pledge'));
  },

  donors: function () {
    return this.belongsToMany(require('./donor')).through(require('./pledge'));
  }

});

module.exports = Campaign;