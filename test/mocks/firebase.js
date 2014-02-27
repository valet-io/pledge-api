var sinon = require('sinon');

var Firebase = sinon.spy(function (ref) {
  this._ref = ref;
  this._val = null;
});

Firebase.prototype.child = function (ref) {
  return new Firebase([this._ref, ref].join('/'));
};

Firebase.prototype.set = function (val) {
  this._val = val;
};
Firebase.prototype.transaction = function (updateFn) {
  this._val = updateFn(this._val);
};

module.exports = Firebase;