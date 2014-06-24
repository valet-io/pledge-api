var Joi   = require('joi');
var Model = require('../lib/db').Model;

var Campaign = Model.extend({
  tableName: 'campaigns',

  schema: {
    id: Joi.string().guid(),
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
