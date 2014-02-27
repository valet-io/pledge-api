var Firebase = require('firebase');

var Campaign = function (id) {
  this._ref = new Firebase('https://valet-io-events.firebaseio.com/campaigns' + id);
};

Campaign.prototype.pledges = {
  _ref: this._ref.child('pledges'),
  create: function (pledge) {
    this._ref.child(pledge.id).set(pledge.data, function () {

    }.bind(this));
  },
  destroy: function (pledge) {
    this._ref.child(pledge.id).remove();
  }
};

Campaign.prototype.aggregates = {
  total: this._ref.child('total'),
  count: this._ref.child('count')
};