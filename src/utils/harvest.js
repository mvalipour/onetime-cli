var config = require('./config');

var settings = config.readDomain('harvest', ['domain', 'email', 'password']);

var Harvest = require('harvest');

module.exports = new Harvest({
    subdomain: settings.domain,
    email: settings.email,
    password: settings.password
});
