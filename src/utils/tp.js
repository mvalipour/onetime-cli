var config = require('./config');

var settings = config.readDomain('tp', ['domain', 'email', 'password']);

var tp = require('tp-api');

module.exports = tp({
    domain: settings.domain + '.tpondemand.com',
    username: settings.email,
    password: settings.password
});
