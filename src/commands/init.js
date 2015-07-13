var inquirer = require('inquirer');
var utils = require('../utils');
var config = require('../config');

function required(i) {
    return !!i;
}

function buildFields(d) {
    return [
        {
            name: 'domain',
            message: 'Your '+d+' domain:',
            validate: required
        },
        {
            name: 'email',
            message: 'Your '+d+' email:',
            validate: required
        },
        {
            type: 'password',
            name: 'password',
            message: 'Your '+d+' password:',
            validate: required
        }
    ];
}

function prompt(d, done) {
    inquirer.prompt(buildFields(d), done);
}

function store(d, res) {
    config.set(d + '_domain', res.domain);
    config.set(d + '_email', res.email);
    config.set(d + '_password', res.password);
}

module.exports = {
    $t: true,
    _: function () {
        prompt('Target Process', function (tp) {
            prompt('Harvest', function (harvest) {
                store('tp', tp);
                store('harvest', harvest);
                config.set('_initialized', true);
                utils.log('onetime was initialized successfully.');
            });
        });
    }
};
