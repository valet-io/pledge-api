'use strict';

require('chai')
  .use(require('chai-as-promised'))
  .use(require('sinon-chai'));
require('sinon-as-promised')(require('bluebird'));
require('bluebird').longStackTraces();
