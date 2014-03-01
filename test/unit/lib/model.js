var expect = require('chai').expect;
var sinon  = require('sinon');
var _      = require('lodash');
var Joi    = require('joi');
var Model  = require('../../../src/lib/model').Model;

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

    });

  });

  describe('#validate', function () {

    it('validates the schema using Joi', function () {
      sinon.stub(Joi, 'validate').returns('validated');
      model.schema = {};
      var validate = model.validate();
      expect(Joi.validate).to.have.been.calledWith(model.toJSON(), model.schema);
      expect(validate).to.equal('validated');
      Joi.validate.restore();
    });

    it('appends timestampts to the schema if used', function () {
      model.schema = {};
      model.validate();
      expect(model.schema).to.have.keys('created_at', 'updated_at');
    });

    it('does not overwrite the timestamp fields', function () {
      model.schema = {};
      sinon.spy(_, 'extend');
      model.schema['created_at'] = Joi.date();
      model.validate();
      expect(_.extend).to.not.have.been.called;
    });

    it('is a noop if there is no schema', function () {
      expect(model.validate.bind(model)).to.not.throw();
    });

  });

});