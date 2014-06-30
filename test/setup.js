'use strict';

var config = require('../config');

config.file('test', __dirname + '/config.json');

require('chai')
  .use(require('chai-as-promised'))
  .use(require('sinon-chai'));
require('sinon-as-promised')(require('bluebird'));
require('bluebird').longStackTraces();
