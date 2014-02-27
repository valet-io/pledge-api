var Joi   = require('joi');
var Model = require('../lib/model').Model;

var Pledge = Model.extend({
  tableName: 'pledges',
  hasTimestamps: true,

  initialize: function () {
    // this.on('created', firebase.pledges.create);
    // this.on('updated', firebase.pledges.update);
    // this.on('destroyed', firebase.pledges.destroy);
  },

  schema: {
    id: Joi.number().integer().min(0).required(),
    amount: Joi.number().integer().min(1).required(),
    donor_id: Joi.number().integer().min(0).required(),
    payment_id: Joi.number().integer().min(0),
    started_at: Joi.date(),
    submitted_at: Joi.date()
  }
});

module.exports = Pledge;