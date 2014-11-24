'use strict';

var joi = require('joi');

exports.callback = joi.alternatives().try([
  joi.object()
    .keys({
      code: joi.string().required(),
      state: joi.string().required()
    })
    .unknown(true),
  joi.object()
    .keys({
      error: joi.string(),
      error_description: joi.string()
    })
    .unknown(true)
]);
