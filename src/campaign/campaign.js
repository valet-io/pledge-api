'use strict';

var Joi       = require('joi');
var bookshelf = require('../db');
var Model     = bookshelf.Model;
var Firebase  = require('firebase');
var config    = require('../../config');

var firebase = new Firebase(config.get('firebase'));

var Campaign = Model.extend({
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
  
  pledges: function () {
    return this.hasMany('Pledge');
  },

  donors: function () {
    return this.belongsToMany('Donor').through('Pledge');
  },

  organization: function () {
    return this.belongsTo('Organization');
  }

});

module.exports = bookshelf.model('Campaign', Campaign);
