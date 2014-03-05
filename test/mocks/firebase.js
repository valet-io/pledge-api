var sinon = require('sinon');

var Firebase = sinon.spy(function (ref) {
  this._ref = ref;
  this._val = null;
});

Firebase.prototype.child = function (ref) {
  return new Firebase([this._ref, ref].join('/'));
};

Firebase.prototype.set = function (val, cb) {
  this._val = val;
  process.nextTick(cb);
};
Firebase.prototype.transaction = function (updateFn, cb) {
  this._val = updateFn(this._val);
  process.nextTick(cb);
};

module.exports = Firebase;