'use strict';

var Model = require('../db').Model;
var hoek  = require('hoek');

module.exports = Model.extend({
  tableName: 'sms_messages'
},
{
  batch: function (messages) {
    var collection = this.collection(messages);
    return collection
      .mapThen(function (model) {
        return hoek.merge(model.toJSON(), model.timestamp());
      })
      .bind(collection)
      .then(function (data) {
        return this.query().insert(data).returning('*');
      })
      .then(collection.set);
  }
});
