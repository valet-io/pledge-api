'use strict';

var uuid = require('node-uuid');

module.exports = [
  {
    id: uuid.v4(),
    created_at: new Date(),
    updated_at: new Date(),
    name: 'Simba\'s Saviors'
  },
  {
    id: uuid.v4(),
    created_at: new Date(),
    updated_at: new Date(),
    name: 'Connect User'
  }
];
