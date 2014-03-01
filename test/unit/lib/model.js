var expect  = require('chai').expect;
var sinon   = require('sinon');
var _       = require('lodash');
var Joi     = require('joi');
var Promise = require('bluebird');
var Model   = require('../../../src/lib/model').Model;

describe('Model', function () {

  var model;
  beforeEach(function () {
    model = new Model();
  });

  it('uses the authorization plugin', function () {
    expect(Model).to.have.a.property('authorize');
  });

  it('has timestamps', function () {
    expect(model.hasTimestamps).to.be.ok;
  });

  describe('events', function () {

    describe('saving', function () {

      it('validates the model', function () {
        sinon.spy(model, 'validate');
        return model.triggerThen('saving').finally(function () {
          expect(model.validate).to.have.been.called;
        });
      });

      it('permits saving if validation returns no errors', function () {
        return model.triggerThen('saving');
      });

      it('halt saving when validation is rejected', function () {
        var err = new Error();
        sinon.stub(model, 'validate').returns(Promise.reject(err));
        return expect(model.triggerThen('saving'))
          .to.be.rejectedWith(err);
      });

      it('can disable validation', function () {
        sinon.spy(model, 'validate');
        return model.triggerThen('saving', null, null, {
          validate: false
        })
        .finally(function () {
          expect(model.validate).to.not.have.been.called;
        });
      });

    });

  });

  describe('#validate', function () {

    it('validates the schema using Joi', function () {
      sinon.stub(Joi, 'validate').returns(null);
      model.schema = {};
      return model.validate().finally(function () {
        expect(Joi.validate).to.have.been.calledWith(model.toJSON(), model.schema);
        Joi.validate.restore();
      });
    });

    it('appends timestamps to the schema if used', function () {
      model.schema = {};
      return model.validate().finally(function () {
        expect(model.schema).to.have.keys('created_at', 'updated_at');
      });
    });

    it('does not overwrite the timestamp fields', function () {
      model.schema = {};
      sinon.spy(_, 'extend');
      model.schema['created_at'] = Joi.date();
      return model.validate().finally(function () {
        expect(_.extend).to.not.have.been.called;
        _.extend.restore();
      });
    });

    it('is a noop if there is no schema', function () {
      return model.validate();
    });

  });

});