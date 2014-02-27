var expect = require('chai').expect;
var sinon  = require('sinon');
var Joi    = require('joi');
var Model  = require('../../../src/lib/model');

describe('Model', function () {

  var model;
  beforeEach(function () {
    model = new Model();
  });

  describe('events', function () {

    describe('saving', function () {

      it('validates the model', function () {
        sinon.spy(model, 'validate');
        model.triggerThen('saving').finally(function () {
          expect(model.validate).to.have.been.called;
        });
      });

    });

  });

  describe('#validate', function () {

    it('validates the schema using Joi', function () {
      sinon.stub(Joi, 'validate');
      model.schema = {};
      model.validate();
      expect(Joi.validate).to.have.been.calledWith(model.toJSON(), model.schema);
      Joi.validate.restore();
    });

    it('is a noop if there is no schema', function () {
      expect(model.validate.bind(model)).to.not.throw();
    });

  });

});