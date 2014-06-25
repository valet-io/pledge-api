'use strict';

var Joi       = require('joi');
var Model     = require('../lib/db').Model;
var Firebase  = require('firebase');
var config    = require('../config');
var internals = {};

internals.firebase = new Firebase(config.get('firebase'));

var Campaign = Model.extend({
  tableName: 'campaigns',

  firebase: function () {
    return internals.firebase.child('campaigns').child(this.id);
  },

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
