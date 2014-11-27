'use strict';

var Joi       = require('joi');
var Firebase  = require('firebase');
var config    = require('../config');
var firebase  = new Firebase(config.get('firebase.endpoint'));

module.exports = function (bookshelf) {
  return bookshelf.model('Campaign', bookshelf.Model.extend({
    tableName: 'campaigns',

    firebase: function () {
      return firebase.child('campaigns').child(this.id);
    },

    schema: {
      id: Joi.string().guid(),
      created_at: Joi.date(),
      updated_at: Joi.date(),
      name: Joi.string().required(),
      host: Joi.string().max(20),
      payments: Joi.boolean().default(true),
      metadata: Joi.object().keys({
        logo: Joi.string(),
        fields: Joi.array().includes(Joi.string())
      })
    },

    organization: function () {
      return this.belongsTo('Organization');
    }

  }));
};
