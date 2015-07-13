module.exports = function () {
    var config = require('../config');
    var Harvest = require('harvest');

    var settings = config.readDomain('harvest', ['domain', 'email', 'password']);

    return new Harvest({
        subdomain: settings.domain,
        email: settings.email,
        password: settings.password
    });
};
