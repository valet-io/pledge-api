require('./setup');

var server = require('../');

describe('Unit Tests', function () {
  require('./unit/donor')(server.plugins.donor.Donor);
  require('./unit/organization')(server.plugins.organization.Organization);
  require('./unit/payment')(server.plugins.payment.Payment, server.plugins.stripe.stripe);
  require('./unit/pledge')(server.plugins.pledge.Pledge, server.plugins.donor.Donor);
});
