'use strict';

var convict = require('convict');
var path    = require('path');

module.exports = convict({
  ssl: {
    doc: 'Redirects all traffic to https',
    format: Boolean,
    default: false,
    env: 'ssl'
  },
  database: {
    client: {
      format: String,
      default: 'pg'
    },
    connection: {
      format: String,
      default: 'postgres://postgres@localhost/valet_io_pledge',
      env: 'DATABASE_URL'
    },
    migrations: {
      directory: {
        format: String,
        default: path.join(__dirname, '/../migrations')
      },
      tableName: {
        format: String,
        default: 'migrations'
      }
    }
  },
  port: {
    format: 'port',
    default: 0,
    env: 'PORT'
  },
  stripe: {
    key: {
      format: String,
      default: null,
      env: 'STRIPE_KEY'
    },
    test_key: {
      format: String,
      default: null,
      env: 'STRIPE_TEST_KEY'
    }
  },
  firebase: {
    endpoint: {
      format: 'url',
      default: null,
      env: 'FIREBASE_ENDPOINT'
    },
    secret: {
      format: String,
      default: null,
      env: 'FIREBASE_SECRET'
    }
  },
  sentry: {
    dsn: {
      format: String,
      default: '',
      env: 'SENTRY_DSN'
    }
  },
  newrelic: {
    format: Boolean,
    default: false,
    env: 'NEW_RELIC_ENABLE'
  }
});
